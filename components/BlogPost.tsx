import Link from "next/link"
import Image from "next/image"
import React from "react"
import { readFileSync } from "fs"
import { join } from "path"
import styles from "./BlogPost.module.css"
import type { BlogPost as BlogPostType } from "../lib/types"

interface BlogPostProps {
  blog: BlogPostType
}

const BlogPost = async ({ blog }: BlogPostProps) => {
  // Read markdown content from the file
  let markdownContent = '';
  try {
    const filePath = join(process.cwd(), 'public', blog.contentFile);
    markdownContent = readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading markdown content:', error);
    markdownContent = 'Content not available.';
  }
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
    // Helper function to process inline markdown (bold, italic, links, etc.)
    const processInlineMarkdown = (text: string) => {
      // Handle links [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      // Handle bold text **text**
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Handle italic text *text*
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return text;
    };

    // Process content to handle lists properly
    const lines = content.split('\n');
    const elements: React.JSX.Element[] = [];
    let listItems: React.JSX.Element[] = [];
    let listKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        const title = processInlineMarkdown(line.substring(2));
        elements.push(<h1 key={i} className={styles.h1} dangerouslySetInnerHTML={{ __html: title }} />);
      }
      else if (line.startsWith('## ')) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        const title = processInlineMarkdown(line.substring(3));
        elements.push(<h2 key={i} className={styles.h2} dangerouslySetInnerHTML={{ __html: title }} />);
      }
      else if (line.startsWith('### ')) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        const title = processInlineMarkdown(line.substring(4));
        elements.push(<h3 key={i} className={styles.h3} dangerouslySetInnerHTML={{ __html: title }} />);
      }
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItem = processInlineMarkdown(line.substring(2));
        listItems.push(<li key={i} className={styles.listItem} dangerouslySetInnerHTML={{ __html: listItem }} />);
      }
      else if (line.startsWith('*') && line.endsWith('*') && !line.includes('**')) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        elements.push(<p key={i} className={styles.italic}>{line.substring(1, line.length - 1)}</p>);
      }
      else if (line.trim() === '') {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        // Don't add <br> for empty lines - they create unwanted spacing
      }
      else {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
          listItems = [];
        }
        const processedLine = processInlineMarkdown(line);
        elements.push(<p key={i} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: processedLine }} />);
      }
    }

    // Close any remaining list
    if (listItems.length > 0) {
      elements.push(<ul key={`list-${listKey++}`} className={styles.list}>{...listItems}</ul>);
    }

    return elements;
  };

  return (
    <article className={styles.blogPost}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to home
        </Link>
        
        <header 
          className={styles.header}
          style={blog.image ? {
            backgroundImage: `url(${blog.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '300px'
          } : undefined}
        >
          {blog.image && <div className={styles.headerOverlay}></div>}
          <div className={styles.headerContent}>
            {blog.featured && <span className={styles.featuredBadge}>Featured</span>}
            
            <h1 className={styles.title}>{blog.title}</h1>
            <h2 className={styles.subtitle}>{blog.subtitle}</h2>
            <div className={styles.meta}>
              <div className={styles.authorInfo}>
                <span className={styles.author}>By {blog.author}</span>
                <span className={styles.date}>{formatDate(blog.date)}</span>
              </div>
            </div>
            
            {/*<div className={styles.tags}>
              {blog.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>*/}
          </div>
        </header>
        
        {blog.callout && (
          <div className={styles.callout}>
            <p>{blog.callout}</p>
          </div>
        )}
        
        <div className={styles.content}>
          {renderContent(markdownContent)}
        </div>
        
        <footer className={styles.footer}>
          <Link href="/" className={styles.backToBlog}>
            ← Back to home
          </Link>
        </footer>
      </div>
    </article>
  )
}

export default BlogPost
