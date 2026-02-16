import styles from "./AboutContent.module.css"
import peopleData from "../app/data/people.json"
import type { PeopleData } from "../lib/types"
import blogData from "../app/data/blogs.json"
import type { BlogData } from "../lib/types"
import Link from "next/link"
export default function AboutContent() {
  const teamMembers: PeopleData = peopleData as PeopleData;
  const blogs: BlogData = blogData as BlogData;
  const newsArticles = blogs
    .filter(blog => blog.tags.includes("news"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.aboutProject}>
            <h2 className={styles.withSubtitle}>A two minute video overview of LEND</h2>
            <div className={styles.subtitle}>By our LEND programme manager, Linda O'Raw</div>
            <video className={styles.videoContainer} controls>
              <source src="/lend.mp4" type="video/mp4" />
            </video>
            <h2>About the LEND project</h2>

            <p>
             Sharing lived experience stories can be beneficial for the quality of life of people with long-term conditions, including dementia. First-person stories, also known as narratives, can provide a form of peer support and validation for people going through similar experiences, and they can also provide learning opportunities for people with dementia and their carers. The use of stories to support others can also empower people with long-term conditions and their carers to live a life that is meaningful to them.
            </p>
            <p>
              Our research team are working with a Lived Experience Advisory Panel (LEAP) who provide feedback that drives our work. The LEAP group are people with dementia and their carers, both current and former, from a range of backgrounds and cultures. The LEAP group, as well as previous conversations with people with lived experience of dementia, have stated that there is a lack of stories and appropriate information for people from ethnic minorities, those who have rarer dementias, the LGBTQIA+ community, and people diagnosed with Young-Onset dementia. 
            </p>
            <p>
              These discussions with people with lived experience have suggested that a platform that has lots of diverse stories about dementia would be useful to both people with dementia and their carers. As a result, the Lived Experience Narratives in Dementia (LEND) programme aims to provide a range of first-person narratives that reflect the different experiences of living with dementia. We hope that LEND will improve quality of life for people with dementia, bring sources of hope, and provide support for individuals with dementia and their carers. 
            </p>
          </div>
        </div>

        
          <aside className={styles.rightColumn}>
            <h2 className={styles.newsTitle}>Latest news</h2>

            {newsArticles.length > 0 ? (
              newsArticles.map((article) => (
                <article key={article.id} className={styles.newsItem}>
                  <h3 className={styles.newsItemTitle}>{article.title}</h3>
                  <p className={styles.newsItemDate}>{formatDate(article.date)}</p>
                  <p className={styles.newsItemText} dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                  <Link href={`/blog/${article.id}`} className={styles.newsItemLink}>
                    Read all about it
                  </Link>
                </article>
              ))
            ) : (
              <p className={styles.newsItemText}>No news articles available at the moment.</p>
            )}
          </aside>
        </div>
      
    </section>
  )
}
