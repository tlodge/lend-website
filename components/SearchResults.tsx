"use client"

import Form from "next/form"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { ReactNode } from "react"
import styles from "./SearchResults.module.css"
import type { SearchEntry } from "../lib/searchIndex"

interface SearchResultsProps {
  index: SearchEntry[];
}

const SNIPPET_LENGTH = 180

const getTerms = (query: string) =>
  Array.from(new Set(query.toLowerCase().split(/\s+/).map((t) => t.replace(/[^\p{L}\p{N}+'-]/gu, "")).filter((t) => t.length > 1)))

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const countMatches = (text: string, term: string) => text.toLowerCase().split(term).length - 1

const scoreEntry = (entry: SearchEntry, terms: string[]) => {
  const title = entry.title.toLowerCase()
  const description = entry.description.toLowerCase()
  const body = (entry.body ?? "").toLowerCase()
  const keywords = (entry.keywords ?? "").toLowerCase()
  let score = 0
  for (const term of terms) {
    const inTitle = countMatches(title, term)
    const inDescription = countMatches(description, term)
    const inBody = countMatches(body, term)
    const inKeywords = countMatches(keywords, term)
    // Every term must appear somewhere
    if (inTitle + inDescription + inBody + inKeywords === 0) return 0
    score += inTitle * 10 + inDescription * 3 + Math.min(inBody, 5) + Math.min(inKeywords, 2)
  }
  return score
}

// Show the description, unless only the body matched; then show the text around the first match
const getSnippet = (entry: SearchEntry, terms: string[]) => {
  const description = entry.description.toLowerCase()
  const body = (entry.body ?? "").toLowerCase()
  const bodyMatches = terms.map((term) => body.indexOf(term)).filter((i) => i >= 0)
  const descriptionMatches = terms.some((term) => description.includes(term))

  if (entry.description && (descriptionMatches || bodyMatches.length === 0)) return entry.description

  const position = bodyMatches.length > 0 ? Math.min(...bodyMatches) : 0
  const start = Math.max(0, position - 60)
  const text = entry.body ?? ""
  const end = Math.min(text.length, start + SNIPPET_LENGTH)
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`
}

const highlight = (text: string, terms: string[]): ReactNode[] => {
  if (terms.length === 0) return [text]
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi")
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? <mark key={i} className={styles.mark}>{part}</mark> : part
  )
}

export default function SearchResults({ index }: SearchResultsProps) {
  const query = (useSearchParams().get("q") ?? "").trim()
  const terms = getTerms(query)

  const results = terms.length === 0 ? [] : index
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)

  return (
    <>
      <Form action="/search" className={styles.form} role="search">
        <label htmlFor="search-page-input" className={styles.visuallyHidden}>Search the LEND website</label>
        <input
          key={query}
          id="search-page-input"
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search the LEND website"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Search</button>
      </Form>

      <p className={styles.summary} role="status">
        {terms.length === 0
          ? "Enter a word or phrase to search the LEND website."
          : results.length === 0
            ? <>No results for <strong>“{query}”</strong>. Try different or fewer words.</>
            : <>{results.length} {results.length === 1 ? "result" : "results"} for <strong>“{query}”</strong></>}
      </p>

      {results.length > 0 && (
        <ol className={styles.results}>
          {results.map(({ entry }) => (
            <li key={`${entry.category}-${entry.title}`} className={styles.result}>
              <p className={styles.category}>{entry.category}</p>
              <h2 className={styles.title}>
                <Link href={entry.href}>{highlight(entry.title, terms)}</Link>
              </h2>
              <p className={styles.snippet}>{highlight(getSnippet(entry, terms), terms)}</p>
            </li>
          ))}
        </ol>
      )}

      {terms.length > 0 && results.length === 0 && (
        <p className={styles.help}>
          You could also look at the <Link href="/about">What is LEND?</Link> or <Link href="/participate">Get involved</Link> pages, or email us at <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>.
        </p>
      )}
    </>
  )
}
