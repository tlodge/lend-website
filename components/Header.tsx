"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import styles from "./Header.module.css"
import Image from "next/image"

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Get involved", href: "/participate", colour: styles.green },
    { name: "Findings", href: "/findings", colour: styles.purple },
    { name: "Contact", href: "/contact", colour: styles.teal },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    // Close menu on Escape key
    if (e.key === 'Escape') {
      closeMenu()
    }
  }

  // TODO: wire up site search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const renderSearch = (id: string) => (
    <form className={styles.search} role="search" onSubmit={handleSearch}>
      <label htmlFor={id} className={styles.visuallyHidden}>Search the LEND website</label>
      <input id={id} type="search" name="q" placeholder="Search" className={styles.searchInput} />
      <button type="submit" className={styles.searchButton} aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
      </button>
    </form>
  )

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/lendlogo.svg" alt="LEND" width={308} height={50} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navArea}>
          {renderSearch("site-search")}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${item.colour} ${pathname === item.href ? styles.active : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileSearch}>{renderSearch("site-search-mobile")}</div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.mobileNavLink} ${item.colour} ${pathname === item.href ? styles.active : ""}`}
            onClick={closeMenu}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          onKeyDown={handleOverlayKeyDown}
          tabIndex={-1}
          aria-hidden="true"
          role="presentation"
        ></div>
      )}
    </header>
  )
}

export default Header
