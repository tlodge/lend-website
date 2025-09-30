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
  const [votes, setVotes] = useState<Record<number, number>>(() => {
    // Initialize votes from localStorage or default to 0
    if (typeof window !== 'undefined') {
      const savedVotes = localStorage.getItem('leap-votes');
      return savedVotes ? JSON.parse(savedVotes) : {};
    }
    return {};
  });
  const [userVotes, setUserVotes] = useState<Set<number>>(() => {
    // Initialize user votes from localStorage
    if (typeof window !== 'undefined') {
      const savedUserVotes = localStorage.getItem('leap-user-votes');
      return savedUserVotes ? new Set(JSON.parse(savedUserVotes)) : new Set();
    }
    return new Set();
  });

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

  const handleVote = (sessionId: number) => {
    const hasVoted = userVotes.has(sessionId);
    
    setVotes(prevVotes => {
      const newVotes = {
        ...prevVotes,
        [sessionId]: hasVoted 
          ? Math.max(0, (prevVotes[sessionId] || 0) - 1)
          : (prevVotes[sessionId] || 0) + 1
      };
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('leap-votes', JSON.stringify(newVotes));
      }
      
      return newVotes;
    });
    
    setUserVotes(prevUserVotes => {
      const newUserVotes = new Set(prevUserVotes);
      if (hasVoted) {
        newUserVotes.delete(sessionId);
      } else {
        newUserVotes.add(sessionId);
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('leap-user-votes', JSON.stringify([...newUserVotes]));
      }
      
      return newUserVotes;
    });
  };

  return (

    <section className={styles.leapSection}>
      <div className={styles.container}>
        <p className={styles.intro}>A whole  variety of interesting questions have emerged from the discussions and feedback so far at our LEAP groups. With your help,  we&apos;d like to investigate further. We will be running a series of hour-long online sessions, where we&apos;ll focus on a single question and we hope to learn as much as we can to support the design of our intervention. We want to develop this with you; to make sure that we create something useful and valuable for people with dementia and their carers. </p>
        <div className={styles.grid}>
          {sessions.map((session, index) => {
            // Check if this card should be hidden
            // Hide the card to the left of an expanded rightmost card
            const rightCardIndex = index + 1;
            const isLeftOfExpandedRightmost = rightCardIndex < sessions.length && 
              (rightCardIndex + 1) % 3 === 0 && 
              expandedCard === sessions[rightCardIndex].id;
            
            if (isLeftOfExpandedRightmost) {
              return null; // Hide this card
            }
            
            return (
            <article 
              key={session.id} 
              className={`${styles.card} ${expandedCard === session.id ? styles.expanded : ""}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.voteContainer}>
                  <button 
                    className={`${styles.heartButton} ${userVotes.has(session.id) ? styles.voted : ''}`}
                    onClick={() => handleVote(session.id)}
                    aria-label={`Vote for ${session.question}`}
                  >
                    <svg 
                      width="23" 
                      height="23" 
                      viewBox="0 0 23 23" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.heartIcon}
                    >
                      <g transform="matrix(1,0,0,1,0.375,0.375)">
        <g transform="matrix(1.01596,0,0,0.97943,-4287.44,1464.01)">
            <path d="M4230.9,-1490.27C4233.18,-1494.76 4237.73,-1494.76 4240.02,-1492.52C4242.29,-1490.27 4242.29,-1485.78 4240.02,-1481.28C4238.42,-1477.91 4234.32,-1474.55 4230.9,-1472.3C4227.48,-1474.55 4223.38,-1477.91 4221.78,-1481.28C4219.5,-1485.78 4219.5,-1490.27 4221.78,-1492.52C4224.06,-1494.76 4228.62,-1494.76 4230.9,-1490.27Z" fill="currentColor"/>
        </g>
    </g>
                    </svg>
                  </button>
                  <span className={styles.voteCount}>{votes[session.id] || 0}</span>
                </div>
                
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
                    <p className={styles.backgroundText} dangerouslySetInnerHTML={{ __html: session.background }} />
                  </div>
                </div>

                {expandedCard === session.id && (
                  <div className={styles.expandedContent}>
                    <div className={styles.researchQuestions}>
                      <h4 className={styles.questionsTitle}>Research Questions</h4>
                      {session.questions.length > 0 ? (
                        <ul className={styles.questionsList}>
                          {session.questions.map((question, index) => (
                            <li key={index} className={styles.questionItem} dangerouslySetInnerHTML={{ __html: question }} />
                          
                            
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
