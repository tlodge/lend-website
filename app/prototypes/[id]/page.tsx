"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import styles from "../prototype.module.css"

// Define your prototypes here
const prototypes: Record<string, { url: string; title: string; description: string }> = {
  "prototype1": {
    url: "https://www.figma.com/proto/YOUR_FILE_ID/PROTOTYPE_1?node-id=YOUR_NODE_ID",
    title: "Prototype 1",
    description: "Interactive prototype for user testing"
  },
  "prototype2": {
    url: "https://www.figma.com/proto/YOUR_FILE_ID/PROTOTYPE_2?node-id=YOUR_NODE_ID",
    title: "Prototype 2",
    description: "Alternative design approach"
  },
  // Add more prototypes as needed
}

export default function PrototypePage() {
  const params = useParams()
  const prototypeId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  const prototype = prototypes[prototypeId]

  if (!prototype) {
    return (
      <>
        <Header />
        <main className={styles.prototypeContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <h1>Prototype Not Found</h1>
              <p className={styles.description}>
                The prototype you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className={styles.prototypeContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>{prototype.title}</h1>
            <p className={styles.description}>
              {prototype.description}
            </p>
          </div>

          <div className={styles.iframeWrapper}>
            {isLoading && (
              <div className={styles.loading}>
                <p>Loading prototype...</p>
              </div>
            )}
            <iframe
              src={prototype.url}
              className={styles.prototypeFrame}
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              title={prototype.title}
            />
          </div>

          <div className={styles.instructions}>
            <h2>Instructions</h2>
            <ul>
              <li>Interact with the prototype above</li>
              <li>Click through the different screens</li>
              <li>Test all interactive elements</li>
              <li>Share your feedback</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

