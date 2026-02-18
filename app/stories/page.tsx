import Header from '@/components/Header'
import SubHeader from '@/components/donation/Header'
import StoriesList from '@/components/donation/StoriesList'
import styles from './page.module.css'

export default function StoriesPage() {
  return (
    <>
      <Header />
      <SubHeader />
      <main className={styles.main}>
        <h1 className={styles.title}>My Stories</h1>
        <p className={styles.subtitle}>
          Review, replay, and submit your saved stories.
        </p>
        <StoriesList />
      </main>
    </>
  )
}
