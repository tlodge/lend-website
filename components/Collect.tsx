"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "./Collect.module.css"
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

        <p>LEND is creating a growing collection of narratives describing people&apos;s experiences of dementia. Our collection includes narratives from caregivers, from people with dementia, and from groups of people talking together. We want to learn how these narratives can help people affected by dementia. We want to give people affected by dementia a space to talk about their experiences. </p>

        <p style={{ paddingTop: 16 }}>
          See our <Link href="/participate">participate page</Link> for opportunities to gift your narrative to LEND.
        </p>
      </div>
    </section>
  )
}

export default ExperimentGrid
