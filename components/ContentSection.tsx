import styles from "./ContentSection.module.css"

const ContentSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.leftColumn}>
        <article className={styles.topArticle}>
          <h2 className={styles.articleTitle}>Which stories are most important to you?</h2>
          <div className={styles.articleMeta}>
            <span>Author: Tom Lodge</span>
            <span>20 August 2025</span>
          </div>
          <p className={styles.articleText}>
            What&apos;s in a story? It&apos;s a good question. There are a multitude of stories and narratives that might be
            useful for people with lived experience of dementia, whether sharing experiences, providing advice,
            correcting misconceptions.
            <br />
            <br />
            But what would you like to see more of? Which features of a story are most important to you? Find out what
            we&apos;ve learnt so far and contribute your own knowledge.
          </p>
          <a href="#" className={styles.readMore}>
            Read more
          </a>
        </article>

        <div className={styles.bottomRow}>
          <article className={styles.bottomArticle + " " + styles.leftImage}>
            <h3 className={styles.smallArticleTitle}>How do stories help us?</h3>
            <div className={styles.articleMeta}>
              <span>Author: Tom Lodge</span>
              <span>20 August 2025</span>
            </div>
            <p className={styles.articleText}>
              What&apos;s in a story? It&apos;s a good question. There are a multitude of stories and narratives that might be
              useful for people with lived experience of dementia, whether sharing experiences, providing advice,
              correcting misconceptions.
            </p>
            <a href="#" className={styles.readMore}>
              Read more
            </a>
          </article>

          <article className={styles.bottomArticle + " " + styles.rightImage}>
            <h3 className={styles.smallArticleTitle}>The promise and perils of AI chat.</h3>
            <div className={styles.articleMeta}>
              <span>Author: Tom Lodge</span>
              <span>20 August 2025</span>
            </div>
            <p className={styles.articleText}>
              What&apos;s in a story? It&apos;s a good question. There are a multitude of stories and narratives that might be
              useful for people with lived experience of dementia, whether sharing experiences, providing advice,
              correcting misconceptions.
            </p>
            <a href="#" className={styles.readMore}>
              Read more
            </a>
          </article>
        </div>
      </div>

      <aside className={styles.rightColumn}>
        <h2 className={styles.newsTitle}>Latest news</h2>

        <article className={styles.newsItem}>
          <h3 className={styles.newsItemTitle}>8th August 2025 LEAP Workshop</h3>
          <p className={styles.newsItemDate}>20 August 2025</p>
          <p className={styles.newsItemText}>
            In a recent workshop at the University of Nottingham our lived-experience panel chatted about the challenges
            that they face and the stories that have been helpful (and unhelpful!) to them. Find out what we learnt and
            tell us about your own experiences.
          </p>
          <a href="#" className={styles.newsItemLink}>
            Read all about it
          </a>
        </article>

        <article className={styles.newsItem}>
          <h3 className={styles.newsItemTitle}>8th August 2025 LEAP Workshop</h3>
          <p className={styles.newsItemDate}>20 August 2025</p>
          <p className={styles.newsItemText}>
            In a recent workshop at the University of Nottingham our lived-experience panel chatted about the challenges
            that they face and the stories that have been helpful (and unhelpful!) to them. Find out what we learnt and
            tell us about your own experiences.
          </p>
          <a href="#" className={styles.newsItemLink}>
            Read all about it
          </a>
        </article>
      </aside>
    </section>
  )
}

export default ContentSection
