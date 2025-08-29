"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Header.module.css"
import Image from "next/image"

const Header = () => {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Resources", href: "/resources" },
    { name: "Participate", href: "/participate" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Publications", href: "/publications" },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}><Image src="/lendlogo.svg" alt="LEND" width={308} height={50} /></div>
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
      </div>
    </header>
  )
}

export default Header
