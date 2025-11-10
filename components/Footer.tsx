import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.decorativeSvg}>
       
        <svg width="1280" height="50px" viewBox="0 0 1280 50">
    <path d="M1280,50l-0,-49.781c-3.141,-0.08 -6.243,-0.153 -9.301,-0.219c-444.178,18.342 -765.816,29.316 -997.661,34.168c-110.89,2.321 -199.857,3.215 -273.038,2.973l0,12.859l1280,-0Z"/>
</svg>
      </div>
      <div className={styles.container}>
        <div className={styles.logoRow}>
          {/*<img
            src="/partners/exeter.svg"
            alt="University of Exeter"
            className={styles.partnerLogo}
          />*/}
          <img
            src="/partners/nottingham.svg"
            alt="University of Nottingham"
            className={styles.partnerLogo}
          />
          
          {/*<img
            src="/partners/leicester.svg"
            alt="University of Leicester"
            className={styles.partnerLogo}
          />
           <img
            src="/partners/bangor.svg"
            alt="University of Bangor"
            className={styles.partnerLogoHigh}
          />
           <img
            src="/partners/uwl.svg"
            alt="University of West London"
            className={styles.partnerLogo}
          />
          <img
            src="/partners/nhs.svg"
            alt="Nottinghamshire Healthcare and Foundation Trust"
            className={styles.partnerLogo}
          />*/}
        </div>
      </div>
    </footer>
  )
}

export default Footer
