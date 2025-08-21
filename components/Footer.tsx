import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.decorativeSvg}>
        <svg width="100%" height="50" viewBox="0 0 1280 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 25C213.33 8.33 426.67 0 640 0C853.33 0 1066.67 8.33 1280 25V50H0V25Z" fill="#F5F9F7" />
        </svg>
      </div>
      <div className={styles.container}>
        <div className={styles.logoRow}>
          <img
            src="/placeholder.svg?height=60&width=120&text=University+Logo"
            alt="Partner 1"
            className={styles.partnerLogo}
          />
          <img
            src="/placeholder.svg?height=60&width=120&text=Healthcare+Logo"
            alt="Partner 2"
            className={styles.partnerLogo}
          />
          <img
            src="/placeholder.svg?height=60&width=120&text=Research+Logo"
            alt="Partner 3"
            className={styles.partnerLogo}
          />
          <img
            src="/placeholder.svg?height=60&width=120&text=Institute+Logo"
            alt="Partner 4"
            className={styles.partnerLogo}
          />
          <img
            src="/placeholder.svg?height=60&width=120&text=Healthcare+Org"
            alt="Partner 5"
            className={styles.partnerLogo}
          />
          <img
            src="/placeholder.svg?height=60&width=120&text=Dementia+Charity"
            alt="Partner 6"
            className={styles.partnerLogo}
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
