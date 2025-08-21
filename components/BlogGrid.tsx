import styles from "./BlogGrid.module.css"

const BlogGrid = () => {
  const articles = [
    {
      title: "How do stories help us?",
      author: "Tom Lodge",
      date: "20 August 2025",
      excerpt:
        "What's in a story? It's a good question. There are a multitude of stories and narratives that might be useful for people with lived experience of dementia, whether sharing experiences, providing advice, correcting misconceptions.",
    },
    {
      title: "The promise and perils of AI chat",
      author: "Tom Lodge",
      date: "20 August 2025",
      excerpt:
        "What's in a story? It's a good question. There are a multitude of stories and narratives that might be useful for people with lived experience of dementia, whether sharing experiences, providing advice, correcting misconceptions.",
    },
    {
      title: "What stories are most important to you?",
      author: "Tom Lodge",
      date: "20 August 2025",
      excerpt:
        "What's in a story? It's a good question. There are a multitude of stories and narratives that might be useful for people with lived experience of dementia, whether sharing experiences, providing advice, correcting misconceptions.",
    },
    {
      title: "Understanding dementia through personal narratives",
      author: "Sarah Williams",
      date: "15 August 2025",
      excerpt:
        "Personal stories provide unique insights into the lived experience of dementia, offering perspectives that clinical research alone cannot capture. These narratives help bridge the gap between medical understanding and human experience.",
    },
    {
      title: "Building supportive communities through storytelling",
      author: "Michael Chen",
      date: "12 August 2025",
      excerpt:
        "Storytelling creates connections between people facing similar challenges. When individuals share their experiences with dementia, they build networks of support and understanding that extend far beyond traditional care settings.",
    },
    {
      title: "The role of family narratives in dementia care",
      author: "Emma Thompson",
      date: "10 August 2025",
      excerpt:
        "Family stories play a crucial role in maintaining identity and connection for people living with dementia. These shared narratives help preserve relationships and provide comfort during difficult transitions.",
    },
  ]

  return (
    <section className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {articles.map((article, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{article.title}</h3>
                <div className={styles.meta}>
                  <span className={styles.author}>Author: {article.author}</span>
                  <span className={styles.date}>{article.date}</span>
                </div>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <button className={styles.readMore}>Read more</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogGrid
