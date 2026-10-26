import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BackLink from "../../components/BackLink"
import LeapSessions from "../../components/LeapSessions"
import styles from "../../components/PageLayout.module.css"
import leapData from "../data/leap-schedule.json"
import type { LEAPData } from "../../lib/types"

const takePartHref = "mailto:LEND@nottingham.ac.uk?subject=Taking%20part%20in%20a%20LEAP%20session"

const LEAPPage = () => {
  const sessions = leapData.sessions as unknown as LEAPData

  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.teal}`}>
          <h1 className={styles.banner}>Lived Experience Advisory Panel (LEAP)</h1>

          <div className={styles.column}>
            <div className={styles.intro}>
              <p>
                The LEAP is a group of people with dementia and carers, both current and former, from a range of backgrounds and cultures. Their feedback drives our work.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Why the LEAP matters</h2>
              <div className={styles.prose}>
                <p>
                  The LEAP, along with earlier conversations with people with lived experience of dementia, told us there is a lack of stories and suitable information for:
                </p>
                <ul>
                  <li>people from ethnic minorities</li>
                  <li>people with rarer dementias</li>
                  <li>the LGBTQIA+ community</li>
                  <li>people diagnosed with young-onset dementia</li>
                </ul>
                <p>
                  These discussions suggested that a platform with lots of diverse stories about dementia would be useful to both people with dementia and their carers. LEND was designed in response.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Questions we are exploring together</h2>
              <div className={styles.prose}>
                <p>
                  Many interesting questions have come out of LEAP discussions and feedback. We explore them in hour-long online sessions, each focusing on a single question, to help shape the design of LEND. Select a question to read more.
                </p>
              </div>
              <LeapSessions sessions={sessions} />
            </section>

            <div className={styles.cta}>
              <p className={styles.ctaText}>Would you like to take part in a LEAP session? Email us and we will let you know when the next one is.</p>
              <a href={takePartHref} className={styles.ctaButton}>I&apos;d like to take part</a>
            </div>

            <p className={styles.smallprint}>
              Questions about the LEAP? Email us at <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>.
            </p>

            <BackLink />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default LEAPPage
