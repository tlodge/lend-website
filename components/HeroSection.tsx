import styles from "./HeroSection.module.css"

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <p className={styles.heroText}>
          Real-life stories may bring comfort, guidance, and hope to carers and people living with dementia. We are
          working with those affected to create an online resources to share helpful experiences. We are funded by the
          National Institute for Health and Care Research (NIHR).
        </p>
      </div>
    </section>
  )
}

export default HeroSection
