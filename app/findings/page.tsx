import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Footer from "../../components/Footer"
import publicationsData from "../data/publications.json"
import type { PublicationData } from "../../lib/types"
import styles from "../../components/Publications.module.css"

function formatMetadata(pub: { journal?: string; year: string; volume?: string; issue?: string; pages?: string }) {
  const parts: string[] = []
  
  if (pub.journal) {
    parts.push(pub.journal)
  }
  
  if (pub.year) {
    parts.push(pub.year)
  }
  
  if (pub.volume || pub.issue || pub.pages) {
    const volumeIssue: string[] = []
    if (pub.volume && pub.issue) {
      volumeIssue.push(`${pub.volume}(${pub.issue})`)
    } else if (pub.volume) {
      volumeIssue.push(pub.volume)
    } else if (pub.issue) {
      volumeIssue.push(`(${pub.issue})`)
    }
    
    if (pub.pages) {
      volumeIssue.push(pub.pages)
    }
    
    if (volumeIssue.length > 0) {
      parts.push(volumeIssue.join(", "))
    }
  }
  
  return parts.length > 0 ? parts.join(", ") : null
}

function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://")
}

function encodeLink(link: string): string {
  if (isExternalLink(link)) {
    return link // External links should already be properly encoded
  }
  // For internal links, encode each path segment to handle special characters like #
  // This ensures # becomes %23, spaces become %20, etc.
  return link.split('/').map(segment => 
    segment ? encodeURIComponent(segment) : segment
  ).join('/')
}

function getTypeDisplayName(type: string): string {
  const typeMap: Record<string, string> = {
    poster: "Poster",
    paper: "Paper",
    journal: "Journal",
    conference: "Conference",
    workshop: "Workshop",
    report: "Report",
    book: "Book",
    other: "Other"
  }
  return typeMap[type] || type
}

export default function Publications() {
  const publications: PublicationData = publicationsData as PublicationData
  
  return (
    <>
      <Header />
      <div className="content-container">
        <HeroSection 
          backgroundImage="pattern.png" 
          isPattern={true} 
          content="<strong>Research findings</strong> from the <strong>LEND</strong> project and related work" 
        />
        <main className={styles.publicationsSection}>
          <div className={styles.container}>
            <h2 className={styles.heading}>Recent Outputs</h2>

            <div className={styles.publicationsList}>
              {publications.map((pub, index) => {
                const metadata = formatMetadata(pub)
                const hasLink = pub.link && pub.link.trim().length > 0
                const external = hasLink && isExternalLink(pub.link!)
                const encodedLink = hasLink ? encodeLink(pub.link!) : null
                
                return (
                  <article key={index} className={styles.publicationCard}>
                    <div className={styles.publicationHeader}>
                      <div className={styles.titleContainer}>
                        {hasLink && encodedLink ? (
                          <h3 className={styles.title}>
                            <a 
                              href={encodedLink} 
                              className={styles.titleLink}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noopener noreferrer" : undefined}
                            >
                              {pub.title}
                            </a>
                          </h3>
                        ) : (
                          <h3 className={styles.title}>{pub.title}</h3>
                        )}
                      </div>
                      {pub.type && (
                        <span className={`${styles.typeBadge} ${styles[pub.type] || styles.other}`}>
                          {getTypeDisplayName(pub.type)}
                        </span>
                      )}
                    </div>

                    {pub.venue && (
                      <p className={styles.venue}>{pub.venue}</p>
                    )}

                    {pub.authors && (
                      <p className={styles.authors}>{pub.authors}</p>
                    )}

                    {metadata && (
                      <div className={styles.metadata}>
                        <div className={styles.metadataItem}>
                          <strong>{metadata}</strong>
                        </div>
                      </div>
                    )}

                    {pub.doi && (
                      <p className={styles.doi}>DOI: {pub.doi}</p>
                    )}

                    {hasLink && encodedLink && (
                      <a
                        href={encodedLink}
                        className={`${styles.linkButton} ${external ? styles.externalLink : ""}`}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                      >
                        {external 
                          ? "View External Link" 
                          : pub.type === "poster" 
                            ? "View Poster" 
                            : "View Publication"}
                      </a>
                    )}
                  </article>
                )
              })}
            </div>

            {publications.length === 0 && (
              <div className={styles.infoBox}>
                <p className={styles.infoBoxText}>
                  No publications available at this time. Check back soon for updates.
                </p>
              </div>
            )}

           
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
