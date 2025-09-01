import Link from "next/link"
import Image from "next/image"
import styles from "./BlogPost.module.css"
import type { BlogPost as BlogPostType } from "../lib/types"

interface BlogPostProps {
  blog: BlogPostType
}

const BlogPost = ({ blog }: BlogPostProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Simple markdown to HTML conversion for basic formatting
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className={styles.h1}>{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className={styles.h2}>{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className={styles.h3}>{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className={styles.listItem}>{line.substring(2)}</li>;
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return <p key={index} className={styles.italic}>{line.substring(1, line.length - 1)}</p>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className={styles.paragraph}>{line}</p>;
      });
  };

  return (
    <article className={styles.blogPost}>
      <div className={styles.container}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to all articles
        </Link>
        
        <header className={styles.header}>
          {blog.featured && <span className={styles.featuredBadge}>Featured</span>}
          
          <h1 className={styles.title}>{blog.title}</h1>
          
          <div className={styles.meta}>
            <div className={styles.authorInfo}>
              <span className={styles.author}>By {blog.author}</span>
              <span className={styles.date}>{formatDate(blog.date)}</span>
            </div>
          </div>
          
          <div className={styles.tags}>
            {blog.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </header>
        
        {blog.callout && (
          <div className={styles.callout}>
            <p>{blog.callout}</p>
          </div>
        )}
        
        {blog.image && (
          <div className={styles.imageContainer}>
            <Image 
              src={blog.image} 
              alt={blog.title}
              width={1280}
              height={600}
              className={styles.featuredImage}
            />
          </div>
        )}
        
        <div className={styles.content}>
          {renderContent(blog.content)}
        </div>
        
        <footer className={styles.footer}>
          <Link href="/blog" className={styles.backToBlog}>
            ← Back to all articles
          </Link>
        </footer>
      </div>
    </article>
  )
}

export default BlogPost
