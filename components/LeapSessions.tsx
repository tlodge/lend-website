import styles from "./LeapSessions.module.css"
import type { LEAPData } from "../lib/types"

interface LeapSessionsProps {
  sessions: LEAPData;
}

export default function LeapSessions({ sessions }: LeapSessionsProps) {
  return (
    <div className={styles.list}>
      {sessions.map((session) => (
        <details key={session.id} className={styles.session}>
          <summary className={styles.summary}>
            <span className={styles.question}>{session.question}</span>
            <span className={styles.chevron} aria-hidden="true" />
          </summary>
          <div className={styles.body}>
            <p dangerouslySetInnerHTML={{ __html: session.background }} />
            {session.questions.length > 0 && (
              <>
                <h3 className={styles.subheading}>What we want to find out</h3>
                <ul>
                  {session.questions.map((question, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: question }} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
