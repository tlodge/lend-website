"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import styles from "./LEAPGrid.module.css"
import leapData from "../app/data/leap-schedule.json"
import type { LEAPData } from "../lib/types"

const LEAPGrid = () => {
  const sessions: LEAPData = leapData.sessions as unknown as LEAPData;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const formatDate = (sessionId: number) => {
    // You can customize this based on your actual session dates
    const sessionDates = {
      1: "8th August 2025",
      2: "15th August 2025", 
      3: "22nd August 2025",
      4: "29th August 2025",
      5: "5th September 2025",
      6: "12th September 2025",
      7: "19th September 2025",
      8: "26th September 2025"
    };
    return sessionDates[sessionId as keyof typeof sessionDates] || "TBD";
  };

  const toggleExpanded = (sessionId: number) => {
    setExpandedCard(expandedCard === sessionId ? null : sessionId);
  };

  return (

    <section className={styles.leapSection}>
      <div className={styles.container}>
        <p className={styles.intro}>A whole  variety of interesting questions have emerged from the discussions and feedback so far at our LEAP groups. With your help,  we&apos;d like to investigate further. We will be running a series of hour-long online sessions, where we&apos;ll focus on a single question and we hope to learn as much as we can to support the design of our intervention. We want to develop this with you; to make sure that we create something useful and valuable for people with dementia and their carers. </p>
        <div className={styles.grid}>
          {sessions.map((session, index) => {
            // Check if this is a rightmost card (3rd column) that is expanded
            const isRightmostCard = (index + 1) % 3 === 0;
            const isThisCardExpanded = expandedCard === session.id;
            
            // Hide the card to the left if this rightmost card is expanded
            if (isRightmostCard && isThisCardExpanded) {
              // This is the expanded rightmost card - show it
            } else if (isRightmostCard && !isThisCardExpanded) {
              // This is a rightmost card but not expanded - check if any rightmost card is expanded
              const anyRightmostExpanded = sessions.some((s, i) => (i + 1) % 3 === 0 && expandedCard === s.id);
              if (anyRightmostExpanded) {
                return null; // Hide this rightmost card if another rightmost is expanded
              }
            } else {
              // This is not a rightmost card - check if it should be hidden
              const rightCardIndex = index + 1;
              const isRightCardExpanded = rightCardIndex < sessions.length && 
                (rightCardIndex + 1) % 3 === 0 && 
                expandedCard === sessions[rightCardIndex].id;
              
              if (isRightCardExpanded) {
                return null; // Hide this card if the rightmost card next to it is expanded
              }
            }
            
            return (
            <article 
              key={session.id} 
              className={`${styles.card} ${expandedCard === session.id ? styles.expanded : ""}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.mainContent}>
                  <h3 className={styles.title}>{session.question}</h3>
                  
                  <div className={styles.dateInfo}>
                    <span className={styles.dateLabel}>Date of session</span>
                    <span className={styles.dateValue}>{formatDate(session.id)}</span>
                  </div>

                  <div className={styles.imageContainer}>
                    <Image 
                      src={`/leap/session-${session.id}${expandedCard === session.id ? '-expanded' : ''}.svg`}
                      alt={`LEAP Session ${session.id}`}
                      width={386}
                      height={90}
                      className={styles.sessionImage}
                    />
                  </div>

                  <div className={styles.backgroundSection}>
                    <p className={styles.backgroundText}>{session.background}</p>
                  </div>
                </div>

                {expandedCard === session.id && (
                  <div className={styles.expandedContent}>
                    <div className={styles.researchQuestions}>
                      <h4 className={styles.questionsTitle}>Research Questions</h4>
                      {session.questions.length > 0 ? (
                        <ul className={styles.questionsList}>
                          {session.questions.map((question, index) => (
                            <li key={index} className={styles.questionItem}>
                              {question}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.noQuestions}>No specific questions listed for this session.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.footerContainer}>
                  <div className={styles.curveImage}>
                    <Image 
                      src="/leap/curve-footer.svg"
                      alt=""
                      width={578}
                      height={40}
                      className={styles.curve}
                    />
                  </div>
                  
                  <div className={styles.footer}>
                    <button 
                      className={styles.readMore}
                      onClick={() => toggleExpanded(session.id)}
                    >
                      {expandedCard === session.id ? "Show less" : "Read more"}
                    </button>
                    <button className={styles.participateButton}>
                      I&apos;d like to take part
                    </button>
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default LEAPGrid
