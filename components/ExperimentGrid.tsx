"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "./ExperimentGrid.module.css"
import experimentData from "../app/data/participate.json"
import type { ExperimentData } from "../lib/types"

const ExperimentGrid = () => {
  const experiments: ExperimentData = experimentData as ExperimentData;
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { key: "ready", label: "Ready now" },
    { key: "online", label: "Online" },
    { key: "on-site", label: "On-site" },
    { key: "one-off", label: "One-off" },
    { key: "regular", label: "Regular" }
  ];

  const toggleFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filterKey)) {
        // Remove filter if it's already active
        return prev.filter(f => f !== filterKey);
      } else {
        // Add filter if it's not active
        return [...prev, filterKey];
      }
    });
  };

  const filteredExperiments = experiments.filter(experiment => {
    // If no filters are active, show all experiments
    if (activeFilters.length === 0) {
      return true;
    }
    // Otherwise, experiment must match at least one active filter
    return activeFilters.some(filter => experiment.tags.includes(filter));
  });

  return (
    <section className={styles.experimentSection}>
      <div className={styles.container}>
        {/*<div className={styles.filterBar}>
          <span className={styles.filterLabel}>Filters:</span>
          {filterOptions.map((option) => (
            <button
              key={option.key}
              className={`${styles.filterButton} ${activeFilters.includes(option.key) ? styles.active : ""}`}
              onClick={() => toggleFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>*/}

        <div className={styles.grid}>
          {filteredExperiments.length <= 0 && <p>No experiments found matching your filters.</p>}
          {filteredExperiments.map((experiment) => (
            <article key={experiment.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.titleContainer}>
                <div 
                  className={styles.title} 
                  dangerouslySetInnerHTML={{ __html: experiment.title }} 
                />
                </div>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>{experiment.location && "Location:"}</span>
                    <span className={styles.metaValue}>{experiment.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>{experiment.date && "Study date:"}</span>
                    <span className={styles.metaValue}>{experiment.date}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>{experiment.duration && "Study duration:"}</span>
                    <span className={styles.metaValue}>{experiment.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.cardBottom}>
                <p className={styles.description} dangerouslySetInnerHTML={{ __html: experiment.description }} />
                <div className={styles.buttons}>
                  {experiment.formUrl ? (
                    <a href={experiment.formUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
                      Take survey
                    </a>
                  ) : experiment.formId ? (
                    <Link href={`/collect/${experiment.formId}`} className={styles.button}>
                      Take survey
                    </Link>
                  ) : (
                    <button className={styles.button}>Find out more</button>
                  )}
                  {/*<button className={styles.button}>Share</button>*/}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperimentGrid
