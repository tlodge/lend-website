import Link from "next/link"
import styles from "./HomeContent.module.css"
import layout from "./PageLayout.module.css"
import blogData from "../app/data/blogs.json"
import type { BlogData } from "../lib/types"

const faqs = [
  {
    title: "What is LEND?",
    href: "/about",
    body: (
      <>
        <p>LEND stands for Lived Experience Narratives in Dementia.</p>
        <p>We want to understand how real-life stories about dementia can help people living with dementia and those who support them.</p>
        <p>What we learn will help us create an online support programme using real dementia stories.</p>
      </>
    ),
  },
  {
    title: "Who are the LEND team?",
    href: "/team",
    body: (
      <>
        <p>We are a mix of academics, clinical psychologists, psychiatrists, economists, statisticians, technologists, and people with lived experience of dementia. The project lead is Professor Martin Orrell, Director of the Institute of Mental Health at the University of Nottingham.</p>
        <p>We also have a Lived Experience Advisory Panel (LEAP) who review and provide feedback on our work.</p>
      </>
    ),
  },
  {
    title: "How can I get involved?",
    href: "/participate",
    body: (
      <p>There are a number of ways you can get involved in LEND. You can share your own story, take part in the LEND study, or complete a survey to help us understand your needs better.</p>
    ),
  },
  {
    title: "How do I contact the LEND team?",
    href: "/contact",
    body: (
      <p>Contact us via our email, <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>, for more information.</p>
    ),
  },
]

export default function HomeContent() {
  const blogs: BlogData = blogData as BlogData
  const newsArticles = blogs
    .filter(blog => blog.tags.includes("news"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className={`${layout.page} ${layout.teal} ${styles.home}`}>
      <h1 className={layout.banner}>Welcome to LEND</h1>

      <section className={styles.intro}>
        <div className={styles.introText}>
          <h2 className={styles.headline}>
            <span className={styles.headlineDark}>Real stories.</span>{" "}
            <span className={styles.headlineAccent}>Shared understanding.</span>
          </h2>
          <p className={styles.lede}>
            LEND is exploring how real-life stories about dementia can support people living with dementia, their families, friends and wider support networks.
          </p>
          <p className={styles.lede}>
            We are working with people affected by dementia to create an online resource that shares helpful experiences.
          </p>
        </div>
        <figure className={styles.videoFigure}>
          <video className={styles.video} controls preload="metadata" poster="/lend-poster.jpg">
            <source src="/lend.mp4" type="video/mp4" />
          </video>
          <figcaption className={styles.videoCaption}>
            A two-minute overview of LEND by our programme manager, Linda O&apos;Raw
          </figcaption>
        </figure>
      </section>

      <section className={styles.faqs} aria-label="About LEND">
        {faqs.map((faq) => (
          <article key={faq.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{faq.title}</h3>
            <div className={styles.cardBody}>{faq.body}</div>
            <Link href={faq.href} className={styles.findOutMore}>
              Find out more<span className={styles.visuallyHidden}> about {faq.title.replace("?", "").toLowerCase()}</span> <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      <section className={styles.getInvolved}>
        <p className={styles.getInvolvedText}>
          We welcome you to get involved in LEND if you are someone with a diagnosis of dementia, or an informal carer such as a family member, partner or friend.
        </p>
        <Link href="/participate" className={styles.ctaButton}>I would like to get involved</Link>
      </section>

      {newsArticles.length > 0 && (
        <section className={styles.news}>
          <div className={styles.newsHeader}>
            <h2 className={styles.newsTitle}>Latest news</h2>
            <Link href="/news" className={styles.newsAll}>View all news</Link>
          </div>
          <div className={styles.newsGrid}>
            {newsArticles.map((article) => (
              <article key={article.id} className={styles.newsItem}>
                <h3 className={styles.newsItemTitle}>{article.title}</h3>
                <p className={styles.newsItemDate}>{formatDate(article.date)}</p>
                <p className={styles.newsItemText} dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                <Link href={`/blog/${article.id}`} className={styles.newsItemLink}>
                  Read more<span className={styles.visuallyHidden}>: {article.title}</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
