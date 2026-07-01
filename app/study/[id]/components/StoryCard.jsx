"use client";

import styles from "./StoryCard.module.css";

export default function StoryCard({ story, actions, titleAction }) {
  return (
    <article className={styles.card}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>{story.title}</h3>
        {titleAction ? <div className={styles.titleAction}>{titleAction}</div> : null}
      </div>
      <div className={styles.contentRow}>
        <div className={styles.imagePlaceholder} aria-hidden="true">
          {story.thumbnailUrl ? (
            <img
              src={story.thumbnailUrl}
              alt=""
              className={styles.thumbnailImg}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            story.imageLabel || "Picture"
          )}
        </div>
        <p className={styles.description}>{story.description}</p>
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </article>
  );
}
