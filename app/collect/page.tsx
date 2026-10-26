import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BackLink from "../../components/BackLink"
import styles from "../../components/PageLayout.module.css"

const shareHref = "mailto:LEND@nottingham.ac.uk?subject=Sharing%20my%20story%20with%20LEND"

export default function CollectPage() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.green}`}>
          <h1 className={styles.banner}>Share your story</h1>

          <div className={styles.column}>
            <div className={styles.intro}>
              <p>Do you have a story about dementia that you would like to share? Your experience could help others going through something similar.</p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Our story collection</h2>
              <div className={styles.prose}>
                <p>
                  LEND is creating a growing collection of stories describing people&apos;s experiences of dementia. Our collection includes stories from carers, from people with dementia, and from groups of people talking together.
                </p>
                <p>
                  We want to learn how these stories can help people affected by dementia, and to give people affected by dementia a space to talk about their experiences.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How you can share</h2>
              <div className={styles.prose}>
                <div className={styles.subgrid}>
                  <div className={styles.subpanel}>
                    <h3>Your own story</h3>
                    <p>If you have been affected by dementia, you can gift your story to LEND, where we will use it to help others.</p>
                  </div>
                  <div className={styles.subpanel}>
                    <h3>A collection of stories</h3>
                    <p>If you have worked with others to collect stories about dementia, you may be able to gift stories from your collection to LEND.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.cta}>
              <p className={styles.ctaText}>Would you like to share your story? Email us and we will tell you more about how it works.</p>
              <a href={shareHref} className={styles.ctaButton}>Share your story</a>
            </div>

            <p className={styles.smallprint}>
              Looking for other ways to take part? See all the options on our <Link href="/participate">Get involved</Link> page.
            </p>

            <BackLink />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
