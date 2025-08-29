// app/resources/page.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Resources.module.css";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type Audience = "Carer" | "Person with dementia" | "Professional" | "Young carer";

type Topic =
  | "Diagnosis"
  | "Care planning"
  | "Money & legal"
  | "Behaviour"
  | "Sleep"
  | "Driving"
  | "Wandering & safety"
  | "Local support";

type Format = "Factsheet" | "Checklist" | "Video" | "Template" | "Helpline" | "Service" | "Guide";

type Action =
  | { type: "view"; label: string; href: string }
  | { type: "download"; label: string; href: string }
  | { type: "call"; label: string; tel: string };

export type ResourceItem = {
  id: string;
  title: string;
  summary: string;
  audience: Audience[];
  topics: Topic[];
  format: Format;
  geography?: string; // e.g. "UK", "England", "Nottingham"
  lastReviewed: string; // ISO date
  source: string; // short source name e.g. "NHS"
  timeToRead?: string; // e.g. "5 min"
  canonical?: boolean; // for helplines etc.
  actions: Action[];
};

// ------------------------------------------------------------------
// Mock data — replace with your merged (BM25 + vector) backend results
// ------------------------------------------------------------------

const MOCK: ResourceItem[] = [
  
  {
    id: "nhs-symptoms",
    title: "Dementia: symptoms, diagnosis and treatment",
    summary:
      "How dementia is diagnosed, what to expect at the GP and memory clinic, and current treatment options.",
    audience: ["Carer", "Person with dementia"],
    topics: ["Diagnosis"],
    format: "Guide",
    geography: "England",
    lastReviewed: "2025-04-18",
    source: "NHS",
    timeToRead: "7 min",
    actions: [{ type: "view", label: "Read on NHS", href: "https://www.nhs.uk/conditions/dementia/" }],
  },
  {
    id: "attendance-allowance",
    title: "Attendance Allowance: how to claim",
    summary:
      "Step‑by‑step guide to claiming Attendance Allowance for people over State Pension age with care needs.",
    audience: ["Carer", "Person with dementia"],
    topics: ["Money & legal"],
    format: "Checklist",
    geography: "UK",
    lastReviewed: "2025-06-05",
    source: "GOV.UK",
    timeToRead: "6 min",
    actions: [{ type: "view", label: "Start your claim", href: "https://www.gov.uk/attendance-allowance" }],
  },
  {
    id: "smi-discount",
    title: "Council Tax: Severe Mental Impairment (SMI) discount",
    summary:
      "How to apply for a council tax exemption or discount due to severe mental impairment (including dementia).",
    audience: ["Carer", "Person with dementia"],
    topics: ["Money & legal"],
    format: "Guide",
    geography: "England",
    lastReviewed: "2025-05-12",
    source: "Local Authority",
    timeToRead: "5 min",
    actions: [{ type: "view", label: "Check eligibility", href: "https://www.gov.uk/council-tax/discounts-for-disabled-people" }],
  },
  {
    id: "driving-dementia",
    title: "Driving and dementia: staying safe and DVLA rules",
    summary:
      "When to tell the DVLA/DVA, assessments, and planning for stopping driving with confidence and dignity.",
    audience: ["Carer", "Person with dementia"],
    topics: ["Driving", "Care planning"],
    format: "Factsheet",
    geography: "UK",
    lastReviewed: "2025-03-28",
    source: "Alzheimer’s Society",
    timeToRead: "8 min",
    actions: [{ type: "view", label: "Read factsheet", href: "https://www.alzheimers.org.uk/" }],
  },
  {
    id: "sleep-issues",
    title: "Sleep problems and dementia: practical tips",
    summary:
      "Common sleep changes with dementia and evidence‑based strategies to improve rest for the person and carers.",
    audience: ["Carer", "Person with dementia"],
    topics: ["Sleep", "Behaviour"],
    format: "Guide",
    geography: "UK",
    lastReviewed: "2025-01-19",
    source: "Alzheimer’s Society",
    timeToRead: "6 min",
    actions: [{ type: "view", label: "Read guide", href: "https://www.alzheimers.org.uk/" }],
  },
  {
    id: "wandering-safety",
    title: "Wandering and safety: making home and walks safer",
    summary:
      "How to reduce risk of getting lost, tech options (GPS, door sensors), and what to do if someone goes missing.",
    audience: ["Carer"],
    topics: ["Wandering & safety", "Behaviour"],
    format: "Guide",
    geography: "UK",
    lastReviewed: "2024-12-08",
    source: "Dementia UK",
    timeToRead: "5 min",
    actions: [{ type: "view", label: "Read guidance", href: "https://www.dementiauk.org/" }],
  },
  {
    id: "lpa-template",
    title: "Lasting Power of Attorney (LPA) starter pack",
    summary:
      "What LPAs cover, when to set them up, and templates for talking with family and professionals.",
    audience: ["Carer", "Person with dementia"],
    topics: ["Money & legal", "Care planning"],
    format: "Template",
    geography: "England",
    lastReviewed: "2025-02-10",
    source: "Age UK",
    timeToRead: "10 min",
    actions: [{ type: "download", label: "Download pack (PDF)", href: "#" }],
  },
];

// ------------------------------------------------------------------
// Simple local search/rank combining keyword + loose semantic hints
// Replace with server call to your hybrid pipeline later
// ------------------------------------------------------------------

function scoreItem(q: string, item: ResourceItem) {
  const query = q.trim().toLowerCase();
  if (!query) return 0.1; // slight default to keep ordering stable
  const hay = (
    item.title + " " + item.summary + " " + item.topics.join(" ") + " " + item.audience.join(" ")
  ).toLowerCase();
  let score = 0;
  query.split(/\s+/).forEach((w) => {
    if (!w) return;
    if (hay.includes(w)) score += 1.25;
    if (item.title.toLowerCase().includes(w)) score += 1.25;
  });
  const synonyms: Record<string, string[]> = {
    gp: ["doctor", "memory clinic"],
    money: ["benefit", "allowance", "discount"],
    drive: ["driving", "dvla", "car"],
    sleep: ["night", "insomnia"],
    wander: ["wandering", "lost", "safety"],
    help: ["support", "helpline"],
  };
  Object.entries(synonyms).forEach(([k, list]) => {
    if (query.includes(k) || list.some((t) => query.includes(t))) score += 0.75;
  });
  if (item.format === "Helpline" && item.canonical) score += 3;
  return score;
}

function fakeSearch(query: string, filters: FiltersState, postcode?: string): ResourceItem[] {
  const base = MOCK.filter((r) => {
    if (filters.audience.length && !filters.audience.some((a) => r.audience.includes(a))) return false;
    if (filters.topics.length && !filters.topics.some((t) => r.topics.includes(t))) return false;
    if (filters.formats.length && !filters.formats.includes(r.format)) return false;
    if (filters.localOnly && r.geography && r.geography !== "UK") return false;
    return true;
  });
  const scored = base
    .map((item) => ({ item, s: scoreItem(query, item) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.item);
  return scored;
}

// ------------------------------------------------------------------
// Filters state + constants
// ------------------------------------------------------------------


type FiltersState = {
  audience: Audience[];
  topics: Topic[];
  formats: Format[];
  localOnly: boolean;
  sort: "Most helpful" | "Latest" | "Shortest read";
};

const DEFAULT_FILTERS: FiltersState = {
  audience: [],
  topics: [],
  formats: [],
  localOnly: false,
  sort: "Most helpful",
};

// ------------------------------------------------------------------
// Small UI helpers (CSS Modules)
// ------------------------------------------------------------------

function Chip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className={styles.chip} onClick={onClick}>
      {children}
    </button>
  );
}

// ------------------------------------------------------------------
// Components
// ------------------------------------------------------------------

function IntentChips({ onPick }: { onPick: (q: string) => void }) {
  const intents = [
    { label: "Carer", q: "carer support" },
    { label: "Newly diagnosed", q: "diagnosis steps" },
    { label: "Money & legal", q: "attendance allowance council tax SMI" },
    { label: "Behaviour", q: "wandering safety" },
    { label: "Sleep", q: "sleep problems" },
    { label: "Driving", q: "driving dvla" },
  ];
  return (
    <div className={styles.intentChips}>
      {intents.map((i) => (
        <Chip key={i.label} onClick={() => onPick(i.q)}>{i.label}</Chip>
      ))}
    </div>
  );
}

function SearchBar({ value, setValue, onSearch }: { value: string; setValue: (v: string) => void; onSearch: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={styles.searchBar}>
      
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="What can I help you find?"
        className={styles.searchInput}
        aria-label="Search resources"
      />
      
      <button onClick={onSearch} aria-label="Search">Search</button>
    </div>
  );
}



function ResultList({ items }: { items: ResourceItem[] }) {
  if (!items.length) {
    return (
      <div className={styles.card + " " + styles.center}>
        <div className={styles.emptyIcon}>🔎</div>
        <p className={styles.muted}>No results yet — try a broader search or open the personaliser.</p>
      </div>
    );
  }
  return (
    <div className={styles.gridCards}>
      {items.map((r) => (
        <ResourceCard key={r.id} item={r} />
      ))}
    </div>
  );
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const firstAction = item.actions[0];
  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            {item.title}
          </h3>
        </header>
        
        <div className={styles.cardBody}>
          <p className={styles.cardSummary}>{item.summary}</p>
          
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>⏱ {item.timeToRead ?? "—"}</span>
            <span className={styles.metaItem}>↗ {item.source}</span>
            <span className={styles.metaItem}>Reviewed {new Date(item.lastReviewed).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardActions}>
        {firstAction?.type === "view" && (
          <a className={styles.actionChip} href={(firstAction as any).href} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        )}
        {firstAction?.type === "download" && (
          <a className={styles.actionChip} href={(firstAction as any).href}>
            Download
          </a>
        )}
        {firstAction?.type === "call" && (
          <a className={styles.actionChip} href={`tel:${(firstAction as any).tel}`}>
            Call now
          </a>
        )}
      </div>
    </article>
  );
}



// ------------------------------------------------------------------
// Personaliser (tiny wizard) — 4 questions → curated plan
// ------------------------------------------------------------------




// ------------------------------------------------------------------
// Page component
// ------------------------------------------------------------------

export default function Resources() {
  const [q, setQ] = useState("");
  const [filters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [results, setResults] = useState<ResourceItem[]>(MOCK);

  useEffect(() => {
    setResults(fakeSearch(q, filters));
  }, []);

  const runSearch = () => {
    const items = fakeSearch(q, filters);
    const sorted = sortItems(items, filters.sort);
    setResults(sorted);
  };

  useEffect(() => {
    runSearch();
  }, [filters]);

  return (

        <main className={styles.pageMain}>
             <div className={styles.panel}>
                  <SearchBar value={q} setValue={(v) => setQ(v)} onSearch={runSearch} />
                  {/* <IntentChips onPick={(val) => { setQ(val); setTimeout(runSearch, 0); }} /> */}
                 
                </div>
          <div className={styles.maxWrap}>
         
            <div className={styles.columns}>
              <div>
               

                <section className={styles.resultsSection}>
                  <ResultList items={results} />
                </section>
              </div>
            </div>
          </div>
        </main>
    
  );
}

function sortItems(items: ResourceItem[], by: FiltersState["sort"]) {
  const arr = [...items];
  if (by === "Latest") arr.sort((a,b) => +new Date(b.lastReviewed) - +new Date(a.lastReviewed));
  if (by === "Shortest read") arr.sort((a,b) => (parseMins(a.timeToRead) ?? 99) - (parseMins(b.timeToRead) ?? 99));
  return arr;
}

function parseMins(s?: string) {
  if (!s) return undefined;
  const m = s.match(/(\d+)/);
  return m ? Number(m[1]) : undefined;
}