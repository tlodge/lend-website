'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, PenLine, Library } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        
        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            href="/donate"
            className={`${styles.navLink} ${pathname === '/donate' ? styles.active : ''}`}
          >
            <PenLine size={18} aria-hidden="true" />
            <span>Capture</span>
          </Link>
          <Link
            href="/stories"
            className={`${styles.navLink} ${pathname === '/stories' ? styles.active : ''}`}
          >
            <Library size={18} aria-hidden="true" />
            <span>My Stories</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
