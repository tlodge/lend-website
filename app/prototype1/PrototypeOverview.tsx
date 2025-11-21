"use client"

import Header from "../../components/Header"
import styles from "./overview.module.css"

interface PrototypeOverviewProps {
  onProceed: () => void
}

export default function PrototypeOverview({ onProceed }: PrototypeOverviewProps) {

  return (
    <>
      <Header />
      <div className={styles.overviewContainer}>
        <div className={styles.overviewContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>LEND Conversational Interface</h1>
          <p className={styles.subtitle}>Prototype Overview</p>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Purpose</h2>
            <p className={styles.sectionText}>
              This prototype explores a conversational approach to finding meaningful narratives 
              for people with dementia and their carers. Rather than traditional keyword searches 
              or complex filters, users can discuss what they&apos;re looking for in natural language.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Rationale</h2>
            <div className={styles.rationaleList}>
              <div className={styles.rationaleItem}>
                <h3 className={styles.rationaleTitle}>Conversational Discovery</h3>
                <p>
                  People often don&apos;t know exactly what they&apos;re looking for. A conversation allows 
                  the system to understand intent, context, and emotional needs—not just keywords.
                </p>
              </div>
              <div className={styles.rationaleItem}>
                <h3 className={styles.rationaleTitle}>Transparency & Control</h3>
                <p>
                  Before showing results, the system explains what it will search for based on the 
                  conversation. Users can review and edit these criteria, maintaining control over 
                  what narratives they see.
                </p>
              </div>
              <div className={styles.rationaleItem}>
                <h3 className={styles.rationaleTitle}>Explainable Recommendations</h3>
                <p>
                  Each recommended story includes a &quot;why this story&quot; feature, allowing users to 
                  understand the reasoning behind recommendations and challenge assumptions.
                </p>
              </div>
              <div className={styles.rationaleItem}>
                <h3 className={styles.rationaleTitle}>Safety & Support</h3>
                <p>
                  Built-in safety features help users manage potentially distressing content, with 
                  immediate access to support resources and calming activities when needed.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <ul className={styles.featuresList}>
              <li>Natural language conversation (text or voice)</li>
              <li>Transparent search criteria that users can review and edit</li>
              <li>Story summaries to help anticipate content</li>
              <li>Playlist creation for offline listening</li>
              <li>Post-viewing conversation to discuss stories</li>
              <li>Personalization based on viewing history</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How to Use This Prototype</h2>
            <p className={styles.sectionText}>
              Interact with the prototype on the left to explore the interface. The panel on the 
              right provides contextual information about each screen as you navigate. You can 
              close or open this panel using the button in the top-right corner.
            </p>
          </section>
        </div>
      </div>
    </div>
    <div className={styles.footer}>
      <button 
        className={styles.proceedButton}
        onClick={onProceed}
      >
        Explore Prototype
      </button>
    </div>
    </>
  )
}




