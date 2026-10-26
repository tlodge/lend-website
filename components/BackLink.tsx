"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./PageLayout.module.css"
import { getTrail } from "../lib/routes"

/** Link back to the parent page, labelled from the breadcrumb trail */
export default function BackLink() {
  const trail = getTrail(usePathname())
  const parent = trail[trail.length - 2]
  if (!parent) return null

  return (
    <div className={styles.back}>
      <Link href={parent.href} className={styles.backLink}>
        <span aria-hidden="true">←</span> Back to {parent.label === "Home" ? "home" : parent.label}
      </Link>
    </div>
  )
}
