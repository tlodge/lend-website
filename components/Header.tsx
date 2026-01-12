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
    { name: "Home", href: "/" },
    { name: "Resources", href: "/resources" },
    { name: "Participate", href: "/participate" },
    { name: "Contact", href: "/contact" },
    { name: "Outputs", href: "/outputs" },
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image src="/lendlogo.svg" alt="LEND" width={308} height={50} />
        </div>
        
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

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
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ""}`}
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
