// app/resources/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import styles from "./Resources.module.css";
import resourcesData from "../app/data/resources.json";

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
// Load data from JSON file
// ------------------------------------------------------------------

const RESOURCES: ResourceItem[] = resourcesData as ResourceItem[];

// ------------------------------------------------------------------
// Simple local search - lowercase string match on title and summary
// ------------------------------------------------------------------

function searchResources(query: string, filters: FiltersState): ResourceItem[] {
  const queryLower = query.trim().toLowerCase();
  
  // Filter by audience, topics, formats, geography
  const filtered = RESOURCES.filter((r) => {
    if (filters.audience.length && !filters.audience.some((a) => r.audience.includes(a))) return false;
    if (filters.topics.length && !filters.topics.some((t) => r.topics.includes(t))) return false;
    if (filters.formats.length && !filters.formats.includes(r.format)) return false;
    if (filters.localOnly && r.geography && r.geography !== "UK") return false;
    return true;
  });
  
  // If no query, return all filtered results
  if (!queryLower) {
    return filtered;
  }
  
  // Split query by whitespace and require ALL words to match (AND logic)
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
  
  return filtered.filter((item) => {
    const titleLower = item.title.toLowerCase();
    const summaryLower = item.summary.toLowerCase();
    const searchText = `${titleLower} ${summaryLower}`;
    
    // All words must be present in title or summary
    return queryWords.every(word => searchText.includes(word));
  });
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
// Components
// ------------------------------------------------------------------

function SearchBar({ value, setValue }: { value: string; setValue: (v: string) => void }) {
  return (
    <div className={styles.searchBar}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What can I help you find?"
        className={styles.searchInput}
        aria-label="Search resources"
      />
    </div>
  );
}



function ResultList({ items }: { items: ResourceItem[] }) {
  if (!items.length) {
    return (
      <div className={styles.card + " " + styles.center}>
       
        <p className={styles.muted}>No results found </p>
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

function encodeLink(link: string): string {
  // Encode each path segment to handle special characters like spaces, #, etc.
  return link.split('/').map(segment => 
    segment ? encodeURIComponent(segment) : segment
  ).join('/')
}

function formatDate(dateString: string): string {
  // Use a consistent date format to avoid hydration mismatches
  // Format: DD/MM/YYYY (e.g., 15/01/2025)
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const firstAction = item.actions[0];
  
  const getActionHref = (action: Action) => {
    if (action.type === "view" || action.type === "download") {
      const href = (action as { href: string }).href;
      // If it's an internal link (starts with /), encode it
      if (href.startsWith("/")) {
        return encodeLink(href);
      }
      return href;
    }
    if (action.type === "call") {
      return `tel:${(action as { tel: string }).tel}`;
    }
    return "#";
  };
  
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
            <span className={styles.metaItem}>Reviewed {formatDate(item.lastReviewed)}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardActions}>
        {firstAction && (
          <>
            {firstAction.type === "view" && (
              <a 
                className={styles.actionChip} 
                href={getActionHref(firstAction)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {firstAction.label || "Open"}
              </a>
            )}
            {firstAction.type === "download" && (
              <a 
                className={styles.actionChip} 
                href={getActionHref(firstAction)}
                download
              >
                {firstAction.label || "Download"}
              </a>
            )}
            {firstAction.type === "call" && (
              <a 
                className={styles.actionChip} 
                href={getActionHref(firstAction)}
              >
                {firstAction.label || "Call now"}
              </a>
            )}
          </>
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
  const [results, setResults] = useState<ResourceItem[]>(RESOURCES);

  useEffect(() => {
    const items = searchResources(q, filters);
    const sorted = sortItems(items, filters.sort);
    setResults(sorted);
  }, [filters, q]);

  return (

        <main className={styles.pageMain}>
             <div className={styles.panel}>
                  <SearchBar value={q} setValue={setQ} />
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