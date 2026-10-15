import Link from "next/link"
import styles from "./InvolvementOptions.module.css"
import type { InvolvementData } from "../lib/types"

interface InvolvementOptionsProps {
  options: InvolvementData;
}

export default function InvolvementOptions({ options }: InvolvementOptionsProps) {
  return (
    <ul className={styles.list}>
      {options.map((option) => (
        <li key={option.id} className={`${styles.option} ${styles[option.colour]}`}>
          <div className={styles.text}>
            <h2 className={styles.title}>{option.title}</h2>
            {option.meta && <p className={styles.meta}>{option.meta}</p>}
            <p className={styles.description}>{option.description}</p>
            {option.link && (
              <Link href={option.link.href} className={styles.link}>
                {option.link.label} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          {option.button.external ? (
            <a href={option.button.href} className={styles.button} target="_blank" rel="noopener noreferrer">
              {option.button.label}<span className={styles.visuallyHidden}> (opens in a new tab)</span>
            </a>
          ) : option.button.href.startsWith("mailto:") ? (
            <a href={option.button.href} className={styles.button}>{option.button.label}</a>
          ) : (
            <Link href={option.button.href} className={styles.button}>{option.button.label}</Link>
          )}
        </li>
      ))}
    </ul>
  )
}
