import rulesConfig from "../data/rules.json";
import { getFlowScreens, getOptionsForScreen } from "../data/flows";
import { selectStories } from "./storySelector";

type Approach = "A" | "B";

type UserType = "a carer" | "a person with dementia guided" | "a person with dementia unguided";

type Responses = Record<string, string[]>;

type Inferred = Record<string, Record<string, number>>;

type RouteNode = {
  id: string;
  depth: number;
  label: string;
  visits: number;
  candidateMean: number;
  candidateMin: number;
  candidateMax: number;
  topStories: string[];
};

type RouteEdge = {
  source: string;
  target: string;
  value: number;
};

type ShrinkagePoint = {
  depth: number;
  screenId: string;
  screenLabel: string;
  min: number;
  p10: number;
  p50: number;
  p90: number;
  max: number;
  mean: number;
};

type OptionDistribution = {
  depth: number;
  screenId: string;
  question: string;
  options: Array<{ option: string; count: number; pct: number }>;
};

type RouteAnalysis = {
  key: string;
  meta: {
    approach: Approach;
    userType: UserType;
    samples: number;
    mode: string;
    screens: Array<{ depth: number; screenId: string; question: string; optionCount: number }>;
  };
  graph: {
    nodes: RouteNode[];
    edges: RouteEdge[];
  };
  shrinkage: ShrinkagePoint[];
  optionDistributions: OptionDistribution[];
};

type NodeAggregate = {
  id: string;
  depth: number;
  label: string;
  visits: number;
  candidateTotal: number;
  candidateMin: number;
  candidateMax: number;
  storyCounts: Record<string, number>;
};

type EdgeAggregate = {
  source: string;
  target: string;
  value: number;
};

const DIMENSIONS = ["topic", "tone", "narrator"] as const;
const DEFAULT_SAMPLES = 700;
const MIN_SCORE = 0.01;
const MAX_NODES_PER_DEPTH = 14;
const MAX_GRAPH_DEPTH = 8;

function makeSeed(approach: Approach, userType: UserType): number {
  let seed = 2166136261;
  const text = `${approach}:${userType}`;
  for (let i = 0; i < text.length; i += 1) {
    seed ^= text.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getRelevantScreens(approach: Approach, userType: UserType) {
  const rulesByScreen = (rulesConfig.rules || {}) as Record<string, Record<string, unknown>>;
  return getFlowScreens(approach, userType)
    .filter((screen: { id: string; type?: string }) => screen.type === "options")
    .map((screen: { id: string; question?: string; options?: string[] }) => {
      const allOptions = getOptionsForScreen(screen, userType);
      const allowedByRules = Object.keys(rulesByScreen[screen.id] || {});
      const options = allOptions.filter((option: string) => allowedByRules.includes(option));
      return {
        depth: 0,
        screenId: screen.id,
        question: screen.question || screen.id,
        options,
      };
    })
    .filter((screen: { options: string[] }) => screen.options.length > 0)
    .map((screen: { screenId: string; question: string; options: string[] }, index: number) => ({
      depth: index + 1,
      screenId: screen.screenId,
      question: screen.question,
      options: screen.options,
    }))
    .slice(0, MAX_GRAPH_DEPTH);
}

function inferTopDimensionsFromResponses(responses: Responses): Inferred {
  const rulesByScreen = (rulesConfig.rules || {}) as Record<string, Record<string, unknown>>;
  const totals: Record<string, Record<string, number>> = {};

  for (const [screenId, selections] of Object.entries(responses)) {
    if (!Array.isArray(selections) || selections.length === 0) continue;
    const screenRules = rulesByScreen[screenId];
    if (!screenRules) continue;

    for (const selected of selections) {
      const selectionRules = screenRules[selected];
      if (!selectionRules) continue;

      for (const [dimensionName, weightedValues] of Object.entries(selectionRules)) {
        if (!totals[dimensionName]) totals[dimensionName] = {};

        for (const [dimensionValue, weight] of Object.entries(weightedValues as Record<string, number>)) {
          totals[dimensionName][dimensionValue] =
            (totals[dimensionName][dimensionValue] || 0) + Number(weight || 0);
        }
      }
    }
  }

  const top: Inferred = {};
  for (const [dimensionName, weightedValues] of Object.entries(totals)) {
    const sorted = Object.entries(weightedValues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sorted.length > 0) {
      top[dimensionName] = Object.fromEntries(sorted);
    }
  }

  return top;
}

function makeStateSignature(inferred: Inferred): string {
  const parts = DIMENSIONS.map((dimension) => {
    const keys = Object.keys(inferred[dimension] || {}).slice(0, 2);
    if (keys.length === 0) return "";
    return `${dimension}:${keys.join("+")}`;
  }).filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : "no-match";
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return values[0];
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const low = Math.floor(idx);
  const high = Math.ceil(idx);
  if (low === high) return sorted[low];
  const w = idx - low;
  return sorted[low] * (1 - w) + sorted[high] * w;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function pruneGraph(nodes: RouteNode[], edges: RouteEdge[]) {
  const byDepth = new Map<number, RouteNode[]>();
  for (const node of nodes) {
    const list = byDepth.get(node.depth) || [];
    list.push(node);
    byDepth.set(node.depth, list);
  }

  const keepIds = new Set<string>(["start"]);
  for (const [depth, depthNodes] of byDepth.entries()) {
    if (depth === 0) continue;
    depthNodes
      .sort((a, b) => b.visits - a.visits)
      .slice(0, MAX_NODES_PER_DEPTH)
      .forEach((node) => keepIds.add(node.id));
  }

  const prunedEdges = edges.filter((edge) => keepIds.has(edge.source) && keepIds.has(edge.target));

  const connected = new Set<string>(["start"]);
  for (const edge of prunedEdges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }

  const prunedNodes = nodes.filter((node) => connected.has(node.id));

  return {
    nodes: prunedNodes,
    edges: prunedEdges,
  };
}

export function buildRouteAnalysis({
  approach,
  userType,
  samples = DEFAULT_SAMPLES,
}: {
  approach: Approach;
  userType: UserType;
  samples?: number;
}): RouteAnalysis {
  const screens = getRelevantScreens(approach, userType);

  const nodeAgg = new Map<string, NodeAggregate>();
  const edgeAgg = new Map<string, EdgeAggregate>();

  const perDepthCandidateCounts: Record<number, number[]> = {};
  const optionCounts: Record<number, Record<string, number>> = {};

  nodeAgg.set("start", {
    id: "start",
    depth: 0,
    label: "start",
    visits: samples,
    candidateTotal: 0,
    candidateMin: 0,
    candidateMax: 0,
    storyCounts: {},
  });

  const rand = mulberry32(makeSeed(approach, userType));

  for (let i = 0; i < samples; i += 1) {
    const responses: Responses = {};
    let previousNodeId = "start";

    for (const screen of screens) {
      const pickIndex = Math.min(
        screen.options.length - 1,
        Math.floor(rand() * screen.options.length)
      );
      const pickedOption = screen.options[pickIndex];

      responses[screen.screenId] = [pickedOption];

      const inferred = inferTopDimensionsFromResponses(responses);
      const candidates = selectStories(inferred, {
        limit: 100000,
        minScore: MIN_SCORE,
      });

      const signature = makeStateSignature(inferred);
      const nodeId = `d${screen.depth}:${signature}`;

      const existing = nodeAgg.get(nodeId);
      if (existing) {
        existing.visits += 1;
        existing.candidateTotal += candidates.length;
        existing.candidateMin = Math.min(existing.candidateMin, candidates.length);
        existing.candidateMax = Math.max(existing.candidateMax, candidates.length);
        for (const story of candidates.slice(0, 3)) {
          existing.storyCounts[story.id] = (existing.storyCounts[story.id] || 0) + 1;
        }
      } else {
        const storyCounts: Record<string, number> = {};
        for (const story of candidates.slice(0, 3)) {
          storyCounts[story.id] = (storyCounts[story.id] || 0) + 1;
        }

        nodeAgg.set(nodeId, {
          id: nodeId,
          depth: screen.depth,
          label: signature,
          visits: 1,
          candidateTotal: candidates.length,
          candidateMin: candidates.length,
          candidateMax: candidates.length,
          storyCounts,
        });
      }

      const edgeKey = `${previousNodeId}-->${nodeId}`;
      const existingEdge = edgeAgg.get(edgeKey);
      if (existingEdge) {
        existingEdge.value += 1;
      } else {
        edgeAgg.set(edgeKey, {
          source: previousNodeId,
          target: nodeId,
          value: 1,
        });
      }

      if (!perDepthCandidateCounts[screen.depth]) {
        perDepthCandidateCounts[screen.depth] = [];
      }
      perDepthCandidateCounts[screen.depth].push(candidates.length);

      if (!optionCounts[screen.depth]) {
        optionCounts[screen.depth] = {};
      }
      optionCounts[screen.depth][pickedOption] = (optionCounts[screen.depth][pickedOption] || 0) + 1;

      previousNodeId = nodeId;
    }
  }

  const nodes: RouteNode[] = Array.from(nodeAgg.values()).map((node) => {
    const topStories = Object.entries(node.storyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    return {
      id: node.id,
      depth: node.depth,
      label: node.label,
      visits: node.visits,
      candidateMean: node.visits > 0 ? round(node.candidateTotal / node.visits) : 0,
      candidateMin: node.candidateMin,
      candidateMax: node.candidateMax,
      topStories,
    };
  });

  const edges: RouteEdge[] = Array.from(edgeAgg.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 900);

  const pruned = pruneGraph(nodes, edges);

  const shrinkage: ShrinkagePoint[] = screens.map((screen) => {
    const values = perDepthCandidateCounts[screen.depth] || [];
    const mean =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;

    return {
      depth: screen.depth,
      screenId: screen.screenId,
      screenLabel: screen.question,
      min: values.length > 0 ? Math.min(...values) : 0,
      p10: round(percentile(values, 0.1)),
      p50: round(percentile(values, 0.5)),
      p90: round(percentile(values, 0.9)),
      max: values.length > 0 ? Math.max(...values) : 0,
      mean: round(mean),
    };
  });

  const optionDistributions: OptionDistribution[] = screens.map((screen) => {
    const total = Object.values(optionCounts[screen.depth] || {}).reduce((sum, v) => sum + v, 0);
    const options = Object.entries(optionCounts[screen.depth] || {})
      .sort((a, b) => b[1] - a[1])
      .map(([option, count]) => ({
        option,
        count,
        pct: total > 0 ? round((count / total) * 100) : 0,
      }));

    return {
      depth: screen.depth,
      screenId: screen.screenId,
      question: screen.question,
      options,
    };
  });

  return {
    key: `${approach}-${userType}`,
    meta: {
      approach,
      userType,
      samples,
      mode: "single-option Monte Carlo route simulation",
      screens: screens.map((screen) => ({
        depth: screen.depth,
        screenId: screen.screenId,
        question: screen.question,
        optionCount: screen.options.length,
      })),
    },
    graph: pruned,
    shrinkage,
    optionDistributions,
  };
}

export function buildAllRouteAnalyses(samples = DEFAULT_SAMPLES): RouteAnalysis[] {
  const userTypes: UserType[] = [
    "a carer",
    "a person with dementia guided",
    "a person with dementia unguided",
  ];
  const approaches: Approach[] = ["A", "B"];

  const analyses: RouteAnalysis[] = [];
  for (const approach of approaches) {
    for (const userType of userTypes) {
      analyses.push(buildRouteAnalysis({ approach, userType, samples }));
    }
  }

  return analyses;
}

export type { RouteAnalysis, RouteNode, RouteEdge, ShrinkagePoint, OptionDistribution };
