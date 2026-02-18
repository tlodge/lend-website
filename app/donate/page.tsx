'use client'

import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import SubHeader from '@/components/donation/Header'
import styles from './page.module.css'

const CaptureTabs = dynamic(() => import('@/components/donation/CaptureTabs'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <>
    <Header/>
      <SubHeader />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Share Your Story</h1>
          <p className={styles.subtitle}>
            Donate your story to the LEND project
          </p>
        </div>
        <section className={styles.card}>
          <CaptureTabs />
        </section>
      </main>
    </>
  )
}
