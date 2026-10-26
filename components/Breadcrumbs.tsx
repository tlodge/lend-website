"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Breadcrumbs.module.css"
import { getTrail } from "../lib/routes"

export default function Breadcrumbs() {
  const pathname = usePathname()
  if (pathname === "/") return null

  const trail = getTrail(pathname)

  return (
    <nav aria-label="Breadcrumb" className={styles.bar}>
      <ol className={styles.list}>
        {trail.map((crumb, i) => {
          const isCurrent = i === trail.length - 1
          return (
            <li key={crumb.href} className={styles.item}>
              {isCurrent ? (
                <span aria-current="page" className={styles.current}>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className={styles.link}>{crumb.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
