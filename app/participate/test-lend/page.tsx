import Link from "next/link"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import styles from "../../../components/PageLayout.module.css"

// TODO: replace with the trial registration link once it exists
const registerHref = "mailto:LEND@nottingham.ac.uk?subject=I%20would%20like%20to%20test%20LEND"

export default function TestLendPage() {
  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.green}`}>
          <h1 className={styles.banner}>Help us test LEND</h1>

          <div className={styles.column}>
            <Link href="/participate" className={styles.breadcrumb}>
              <span aria-hidden="true">←</span> All ways to get involved
            </Link>

            <div className={styles.intro}>
              <p>
                We welcome you to take part if you are someone with a diagnosis of dementia, or an informal carer such as a family member, partner or friend.
              </p>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What is this study looking at?</h2>
              <div className={styles.prose}>
                <p>
                  This study looks at the impact of LEND. We want to hear what worked for you and what didn&apos;t, so that we can make LEND as helpful as possible. We will ask questions such as:
                </p>
                <ul>
                  <li>Which features of LEND did you like?</li>
                  <li>Has using LEND made a difference to your life? How?</li>
                  <li>Is there anything that needs changing?</li>
                </ul>
                <p>
                  Your answers will shape the design and content of the final version of LEND, so that it is guided by people with lived experience – the people we hope it will help.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Am I eligible to take part?</h2>
              <div className={styles.prose}>
                <p>To take part in this study, you must:</p>
                <ul>
                  <li>have access to a device with an internet connection</li>
                  <li>have an email address or phone number</li>
                  <li>have a formal diagnosis of dementia, or be a carer or supporter of someone with a diagnosis of dementia</li>
                  <li>be able to start on <strong>[start date to be confirmed]</strong>, use LEND for 3 months, and take part in follow-up interviews 3, 12 and 18 months after the start date</li>
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What would I need to do?</h2>
              <div className={styles.prose}>
                <p>If you register, you will be randomly placed in one of two groups for the whole study:</p>
                <div className={styles.subgrid}>
                  <div className={styles.subpanel}>
                    <h3>Testing group</h3>
                    <p>
                      You will have access to LEND for 3 months, and can use it as often or as little as you like. LEND researchers will contact you 3, 12 and 18 months after the start date to ask about your experience.
                    </p>
                  </div>
                  <div className={styles.subpanel}>
                    <h3>Non-testing group</h3>
                    <p>
                      You will not use LEND. LEND researchers will contact you 3, 12 and 18 months after the start date to ask you some questions.
                    </p>
                  </div>
                </div>
                <p>Comparing the two groups helps us to see whether LEND makes a meaningful, long-term difference to quality of life.</p>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>What else do I need to know?</h2>
              <div className={styles.prose}>
                <ul>
                  <li>Taking part is voluntary. You can withdraw from the study at any time, without giving a reason.</li>
                  <li>We do not offer payment for taking part in this study.</li>
                  <li>We cannot promise that taking part will bring long-term benefits.</li>
                  <li>You cannot take part in other research studies while you are in this study.</li>
                </ul>
              </div>
            </section>

            <div className={styles.cta}>
              <p className={styles.ctaText}>Would you like to take part? Get in touch and we will explain the next steps.</p>
              <a href={registerHref} className={styles.ctaButton}>I want to test LEND</a>
            </div>

            <p className={styles.smallprint}>
              Questions about the study? Email us at <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
