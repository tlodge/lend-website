import { Suspense } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import SearchResults from "../../components/SearchResults"
import styles from "../../components/PageLayout.module.css"
import { buildSearchIndex } from "../../lib/searchIndex"

export const metadata = {
  title: "Search – LEND",
}

export default function SearchPage() {
  // Built at build time, so the page stays static and needs no server-side file access
  const index = buildSearchIndex()

  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.teal}`} style={{ minHeight: "75vh" }}>
          <h1 className={styles.banner}>Search</h1>
          <div className={styles.column}>
            <Suspense>
              <SearchResults index={index} />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
