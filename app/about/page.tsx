import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import styles from "../../components/PageLayout.module.css"

export default function About() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.teal}`}>
          <h1 className={styles.banner}>What is LEND?</h1>

          <div className={styles.column}>
            <div className={styles.intro}>
              <p>
                LEND stands for Lived Experience Narratives in Dementia. We welcome you to get involved if you are someone with a diagnosis of dementia, or an informal carer such as a family member, partner or friend.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Why are stories important for dementia support?</h2>
              <div className={styles.prose}>
                <p>Sharing stories can improve quality of life for people affected by dementia. Stories of lived experience can:</p>
                <ul>
                  <li>improve understanding of dementia</li>
                  <li>foster empowerment and reduce loneliness</li>
                  <li>help others to find meaning</li>
                  <li>support and validate others going through their own journeys</li>
                </ul>
                <p>
                  These benefits are not only for people with a diagnosis. They can also reach the people who support them – family, friends and carers.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What are the aims of LEND?</h2>
              <div className={styles.prose}>
                <p>
                  Conversations between LEND researchers and people with lived experience have shown how important it is to have a diverse set of stories. We want to hear from people from all walks of life.
                </p>
                <p>
                  LEND aims to collect a range of first-person stories that reflect these different dementia journeys. We hope the online tool we create from them will improve quality of life for people with dementia and their carers.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Working alongside people with lived experience</h2>
              <div className={styles.prose}>
                <p>
                  To understand how best to design LEND, we formed the Lived Experience Advisory Panel (LEAP). The LEAP is made up of people with dementia and carers, both current and former, from a range of backgrounds and cultures. They meet to help guide the direction of LEND.
                </p>
                <p>The LEAP has helped us to highlight gaps in the stories available from:</p>
                <ul>
                  <li>people from ethnic minorities</li>
                  <li>people with rarer dementias, such as young-onset dementia</li>
                  <li>the LGBTQIA+ community</li>
                </ul>
              </div>
              <Link href="/leap" className={styles.textLink}>
                Find out more about the LEAP <span aria-hidden="true">→</span>
              </Link>
            </section>

            <div className={styles.cta}>
              <p className={styles.ctaText}>Would you like to help shape LEND? There are several ways you can take part.</p>
              <Link href="/participate" className={styles.ctaButton}>I want to get involved</Link>
            </div>

            <p className={styles.smallprint}>
              Interested to learn more? Email us at <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
