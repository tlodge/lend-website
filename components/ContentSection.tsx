import Link from "next/link"
import styles from "./ContentSection.module.css"
import blogData from "../app/data/blogs.json"
import type { BlogData } from "../lib/types"

const ContentSection = () => {
  const blogs: BlogData = blogData as BlogData;
  
  // Get frontpage articles
  const topArticle = blogs.find(blog => blog.frontpage === 1);
  const bottomLeftArticle = blogs.find(blog => blog.frontpage === 2);
  const bottomRightArticle = blogs.find(blog => blog.frontpage === 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.leftColumn}>
        {topArticle && (
          <article className={styles.topArticle}>
            <h2 className={styles.articleTitle}>{topArticle.title}</h2>
            <div className={styles.articleMeta}>
              <span>Author: {topArticle.author}</span>
              <span>{formatDate(topArticle.date)}</span>
            </div>
            <p className={styles.articleText} dangerouslySetInnerHTML={{ __html: topArticle.excerpt }} />
            <Link href={`/blog/${topArticle.id}`} className={styles.readMore}>
              Read more
            </Link>
          </article>
        )}

        <div className={styles.bottomRow}>
          {bottomLeftArticle && (
            <article className={styles.bottomArticle + " " + styles.leftImage}>
              <h3 className={styles.smallArticleTitle}>{bottomLeftArticle.title}</h3>
              <div className={styles.articleMeta}>
                <span>Author: {bottomLeftArticle.author}</span>
                <span>{formatDate(bottomLeftArticle.date)}</span>
              </div>
              <p className={styles.articleText} dangerouslySetInnerHTML={{ __html: bottomLeftArticle.excerpt }} />
              <Link href={`/blog/${bottomLeftArticle.id}`} className={styles.readMore}>
                Read more
              </Link>
            </article>
          )}

          {bottomRightArticle && (
            <article className={styles.bottomArticle + " " + styles.rightImage}>
              <h3 className={styles.smallArticleTitle}>{bottomRightArticle.title}</h3>
              <div className={styles.articleMeta}>
                <span>Author: {bottomRightArticle.author}</span>
                <span>{formatDate(bottomRightArticle.date)}</span>
              </div>
              <p className={styles.articleText} dangerouslySetInnerHTML={{ __html: bottomRightArticle.excerpt }} />
              <Link href={`/blog/${bottomRightArticle.id}`} className={styles.readMore}>
                Read more
              </Link>
            </article>
          )}
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
