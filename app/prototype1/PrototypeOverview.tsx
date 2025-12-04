"use client"

import Header from "../../components/Header"
import styles from "./overview.module.css"

interface PrototypeOverviewProps {
  onProceed: () => void
}


const PROTOTTYPE_VERSION = "v1_24Nov25";

const paragraphs = ["We’re taking a research-through-design approach [1] to the LEND intervention, iteratively creating a series of prototypes to explore and critically examine several early design hypotheses, and to prompt discussions within the project team. To do this, we’d like to periodically invite project members to engage with prototypes, prior to our co-design workshops with our LEAP group. These early explorations are preparatory and will complement co-design. ",
"Insights from each round will feed into later prototypes and workshops, to support iterative design. ",
"Please send any feedback (with screenshots if appropriate) to <strong>tom.lodge1@nottingham.ac.uk</strong>","This protototype is exploring a few of the hypotheses set out below:"]

const table = [
              [
                {
                  "title": "Search as learning",
                  "description": "Users may not know what they are looking for at the outset [2]. This can be supported  through dialogue and exploration rather than single, goal-directed queries [3].",
                  "concepts":[{
                    "title": "Conversational Search",
                    "description": "where users interact with the system to clarify their needs and interests over time.",
                  }]
                },
                {
                  "title": "Emotional safety",
                  "description": "The potential for distress in response to narrative content is highly individual and often unpredictable, both for the system and for users [4] ",
                  "concepts":[{
                    "title": "Transparent Recommendations",
                    "description": "showing why particular narratives are suggested and allowing users to correct or refine assumptions",
                  },{
                    "title": "Pre-view summaries",
                    "description": "that outline potentially sensitive content to support emotional safety.",
                  }]
                },
                {
                  "title": "Personalization and appropriation",
                  "description": "Engagement deepens when people can appropriate an intervention to fit within their routines [5]",
                  "concepts":[{
                    "title": "Flexible engagement modes",
                    "description": "such as playlists, enabling users to pace interaction in line with their own routines.",
                  }]
                },
                {
                  "title": "Reflection",
                  "description": "Users value being able to reflect on narratives [6]; it supports their learning and may provide the intervention with further insight into their needs.",
                  "concepts":[{
                    "title": "Integrated reflection prompts",
                    "description": "that invite users to discuss or comment on viewed narratives, feeding back into subsequent recommendations.",
                  }]
                }
              ],


]

export default function PrototypeOverview({ onProceed }: PrototypeOverviewProps) {

  return (
    <>
      <Header />
      <div className={styles.overviewContainer}>
        <div className={styles.overviewContent}>
        <div className={styles.header}>
          <p className={styles.version}>{PROTOTTYPE_VERSION}</p>
          <h1 className={styles.title}>LEND Conversational Interface</h1>
          <p className={styles.subtitle}>Prototype Overview</p>
        </div>

        <div className={styles.sections}>
          <section className={styles.section}>
            <div className={styles.introText}>
              {paragraphs.map((paragraph, index) => {
                // Split paragraph by reference numbers and create clickable links
                const parts = paragraph.split(/(\[\d+\])/g);
                return (
                  <p key={index} className={styles.paragraph}>
                    {parts.map((part, partIndex) => {
                      const refMatch = part.match(/\[(\d+)\]/);
                      if (refMatch) {
                        const refNum = refMatch[1];
                        return (
                          <a
                            key={partIndex}
                            href={`#ref-${refNum}`}
                            className={styles.refLink}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(`ref-${refNum}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          >
                            {part}
                          </a>
                        );
                      }
                      return <span key={partIndex} dangerouslySetInnerHTML={{__html: part}}></span>;
                    })}
                  </p>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <table className={styles.designTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Design Hypothesis</th>
                  <th className={styles.tableHeader}>Concepts</th>
                </tr>
              </thead>
              <tbody>
                {table[0].map((row, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <h4 className={styles.hypothesisTitle}>{row.title}</h4>
                      <p className={styles.hypothesisDescription}>
                        {row.description.split(/(\[\d+\])/g).map((part, partIndex) => {
                          const refMatch = part.match(/\[(\d+)\]/);
                          if (refMatch) {
                            const refNum = refMatch[1];
                            return (
                              <a
                                key={partIndex}
                                href={`#ref-${refNum}`}
                                className={styles.refLink}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const element = document.getElementById(`ref-${refNum}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }
                                }}
                              >
                                {part}
                              </a>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </p>
                    </td>
                    <td className={styles.tableCell}>
                      {row.concepts.map((concept, conceptIndex) => (
                        <div key={conceptIndex} className={styles.concept}>
                          <strong className={styles.conceptTitle}>{concept.title}</strong>
                          <p className={styles.conceptDescription}>{concept.description}</p>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>References</h2>
            <div className={styles.references}>
              <div id="ref-1" className={styles.reference}>
                <span className={styles.referenceNumber}>[1]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Zimmerman, J., Forlizzi, J., & Evenson, S. (2007). Research through design as a method for interaction design research in HCI. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI ’07) (pp. 493–502). New York, NY: ACM. 
                  </div>
                  <a href="https://doi.org/10.1145/1240824.1240704" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                    https://doi.org/10.1145/1240824.1240704
                  </a>
                </div>
              </div>
              <div id="ref-2" className={styles.reference}>
                <span className={styles.referenceNumber}>[2]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Marchionini, G. (2006). Exploring information spaces: The roles of curiosity and learning in information seeking. Bulletin of the American Society for Information Science and Technology, 32(4), 12–19.                   </div>
                  <a href="https://doi.org/10.1002/bult.2006.1720320406" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                  https://doi.org/10.1002/bult.2006.1720320406
                  </a>
                </div>
              </div>
              <div id="ref-3" className={styles.reference}>
                <span className={styles.referenceNumber}>[3]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Collins-Thompson, K., et al. (2016). Search as learning (Dagstuhl Seminar 15391). Dagstuhl Reports, 5(9), 38–83. 
                  </div>
                  <a href="https://doi.org/10.4230/DagRep.5.9.38" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                  https://doi.org/10.4230/DagRep.5.9.38
                  </a>
                </div>
              </div>
              <div id="ref-4" className={styles.reference}>
                <span className={styles.referenceNumber}>[4]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Dementia Narratives. (2023). Theme 3: Emotional safety. 
                  </div>
                  <a href="https://www.dementianarratives.org/blog/theme3" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                  https://www.dementianarratives.org/blog/theme3
                  </a>
                </div>
              </div>
              <div id="ref-5" className={styles.reference}>
                <span className={styles.referenceNumber}>[5]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Ali, Y., et al. (2024). Perception and appropriation of a web-based recovery narratives intervention: Qualitative interview study. Frontiers in Digital Health, 6, 1297935. 
                  </div>
                  <a href="https://doi.org/10.3389/fdgth.2024.1297935" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                  https://doi.org/10.3389/fdgth.2024.1297935
                  </a>
                </div>
              </div>
              <div id="ref-6" className={styles.reference}>
                <span className={styles.referenceNumber}>[6]</span>
                <div className={styles.referenceContent}>
                  <div className={styles.referenceDetails}>
                  Dementia Narratives. (2023). Theme 2: Reflection. 
                                    </div>
                  <a href="https://www.dementianarratives.org/blog/theme2" target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                    https://www.dementianarratives.org/blog/theme2
                  </a>
                </div>
              </div>
            </div>
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




