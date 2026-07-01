import storiesSource from "../data/stories.json";

type DimensionName = "topic" | "tone" | "narrator";

type WeightedValues = Record<string, number>;

export type InferredDimensionsInput = Partial<Record<DimensionName, WeightedValues>>;
export type StoryAttributeFilter = {
  value: string;
  tagKeys: string[];
  label?: string;
};

export type StorySelectorOptions = {
  limit?: number;
  minScore?: number;
  excludeStoryIds?: string[];
  includeInvalidStories?: boolean;
  dimensionWeights?: Partial<Record<DimensionName, number>>;
  requiredStoryAttributes?: StoryAttributeFilter[];
  requiredNarratorTagKeys?: string[];
};

export type MatchContribution = {
  dimension: DimensionName;
  value: string;
  inferredWeight: number;
  dimensionWeight: number;
  storyHasTag: boolean;
  contribution: number;
};

export type DimensionMatchDetail = {
  dimension: DimensionName;
  matchedValues: string[];
  unmatchedValues: string[];
  dimensionScore: number;
};

export type StorySelection = {
  id: string;
  transcriptFile: string;
  summary: string;
  image?: string;
  score: number;
  confidence: number | null;
  matchedOn: DimensionMatchDetail[];
  contributions: MatchContribution[];
  attributeMatches: Record<string, string>;
  tags: Record<DimensionName, string[]>;
};

type StoryRecord = {
  id: string;
  transcriptFile?: string;
  storyFile?: string;
  summary: string;
  image?: string;
  coding?: {
    confidence?: number | null;
  };
  tags: Record<string, string[]>;
  validation?: {
    isValid?: boolean;
  };
};

type StoriesFile = {
  stories: StoryRecord[];
};

const DEFAULT_DIMENSION_WEIGHTS: Record<DimensionName, number> = {
  topic: 1,
  tone: 0.7,
  narrator: 0.9,
};

function getDimensionNames(input: InferredDimensionsInput): DimensionName[] {
  const names: DimensionName[] = ["topic", "tone", "narrator"];
  return names.filter((name) => !!input[name] && Object.keys(input[name] || {}).length > 0);
}

function roundScore(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function selectStories(
  inferred: InferredDimensionsInput,
  options: StorySelectorOptions = {}
): StorySelection[] {
  const source = storiesSource as unknown as StoriesFile;
  const stories = source.stories || [];

  const excludeIds = new Set(options.excludeStoryIds || []);
  const includeInvalid = Boolean(options.includeInvalidStories);
  const limit = options.limit ?? 3;
  const minScore = options.minScore ?? 0.01;
  const requiredAttributes = options.requiredStoryAttributes || [];
  const activeRequiredAttributes = requiredAttributes.filter(
    (item) =>
      typeof item?.value === "string" &&
      item.value.length > 0 &&
      Array.isArray(item.tagKeys) &&
      item.tagKeys.length > 0
  );
  const requiredNarratorTagKeys = (options.requiredNarratorTagKeys || []).filter(Boolean);

  const dimensionWeights: Record<DimensionName, number> = {
    topic: options.dimensionWeights?.topic ?? DEFAULT_DIMENSION_WEIGHTS.topic,
    tone: options.dimensionWeights?.tone ?? DEFAULT_DIMENSION_WEIGHTS.tone,
    narrator: options.dimensionWeights?.narrator ?? DEFAULT_DIMENSION_WEIGHTS.narrator,
  };

  const activeDimensions = getDimensionNames(inferred);
  if (activeDimensions.length === 0) {
    return [];
  }

  const scored = stories
    .filter((story) => !excludeIds.has(story.id))
    .filter((story) => includeInvalid || story.validation?.isValid !== false)
    .filter((story) => {
      if (requiredNarratorTagKeys.length === 0) return true;
      return requiredNarratorTagKeys.some((tagKey) => (story.tags?.[tagKey] || []).length > 0);
    })
    .filter((story) =>
      activeRequiredAttributes.every(({ value, tagKeys }) => {
        return tagKeys.some((tagKey) => {
          const storyValues = story.tags?.[tagKey] || [];
          return storyValues.includes(value);
        });
      })
    )
    .map((story) => {
      const contributions: MatchContribution[] = [];
      const matchedOn: DimensionMatchDetail[] = [];
      const attributeMatches = Object.fromEntries(
        activeRequiredAttributes.map(({ value, tagKeys, label }) => [
          label || tagKeys.join("|"),
          value,
        ])
      );
      let totalScore = 0;

      for (const dimension of activeDimensions) {
        const requestedWeights = inferred[dimension] || {};
        const storyTags = new Set(story.tags?.[dimension] || []);
        const matchedValues: string[] = [];
        const unmatchedValues: string[] = [];
        let dimensionScore = 0;

        for (const [value, inferredWeight] of Object.entries(requestedWeights)) {
          const hasTag = storyTags.has(value);
          const dimWeight = dimensionWeights[dimension];
          const contribution = hasTag ? inferredWeight * dimWeight : 0;

          contributions.push({
            dimension,
            value,
            inferredWeight,
            dimensionWeight: dimWeight,
            storyHasTag: hasTag,
            contribution: roundScore(contribution),
          });

          if (hasTag) {
            matchedValues.push(value);
            dimensionScore += contribution;
          } else {
            unmatchedValues.push(value);
          }
        }

        totalScore += dimensionScore;
        matchedOn.push({
          dimension,
          matchedValues,
          unmatchedValues,
          dimensionScore: roundScore(dimensionScore),
        });
      }

      const confidence =
        typeof story.coding?.confidence === "number" && Number.isFinite(story.coding.confidence)
          ? story.coding.confidence
          : null;

      return {
        id: story.id,
        transcriptFile: story.transcriptFile || story.storyFile || "",
        summary: story.summary,
        image: story.image || `/thumbnails/${story.id}.jpg`,
        score: roundScore(totalScore),
        confidence,
        matchedOn,
        contributions: contributions
          .filter((item) => item.storyHasTag)
          .sort((a, b) => b.contribution - a.contribution),
        attributeMatches,
        tags: {
          topic: story.tags?.topic || [],
          tone: story.tags?.tone || [],
          narrator: story.tags?.narrator || [],
        },
      } satisfies StorySelection;
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const bConfidence = b.confidence ?? 0;
      const aConfidence = a.confidence ?? 0;
      return bConfidence - aConfidence;
    });

  return scored.slice(0, Math.max(0, limit));
}

export function summarizeSelection(selection: StorySelection): string {
  const parts: string[] = [];
  for (const detail of selection.matchedOn) {
    if (detail.matchedValues.length === 0) continue;
    parts.push(`${detail.dimension}: ${detail.matchedValues.join(", ")}`);
  }


  for (const [attributeName, value] of Object.entries(selection.attributeMatches || {})) {
    parts.push(`${attributeName}: ${value}`);
  }
  return parts.length > 0 ? parts.join(" | ") : "No direct dimension overlap";
}
