import Link from "next/link"
import styles from "./BlogGrid.module.css"
import blogData from "../app/data/blogs.json"
import type { BlogData } from "../lib/types"

const BlogGrid = () => {
  const blogs: BlogData = blogData as BlogData;
  
  // Sort blogs by date (newest first)
  const sortedBlogs = blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {sortedBlogs.map((blog) => (
            <article key={blog.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{blog.title}</h3>
                <div className={styles.meta}>
                  <span className={styles.author}>Author: {blog.author}</span>
                  <span className={styles.date}>{formatDate(blog.date)}</span>
                </div>
                <p className={styles.excerpt}>{blog.excerpt}</p>
                <div className={styles.tags}>
                  {blog.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${blog.id}`} className={styles.readMore}>
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogGrid
