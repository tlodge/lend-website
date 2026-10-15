import Header from "../../components/Header"
import Footer from "../../components/Footer"
import InvolvementOptions from "../../components/InvolvementOptions"
import styles from "../../components/PageLayout.module.css"
import involvementData from "../data/involvement.json"
import type { InvolvementData } from "../../lib/types"

const numberWords = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]

const ParticipatePage = () => {
  const options = involvementData as InvolvementData
  const count = numberWords[options.length] ?? String(options.length)

  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.green}`}>
          <h1 className={styles.banner}>Get involved</h1>

          <div className={styles.column}>
            <div className={styles.intro}>
              <p>
                We welcome you to get involved in LEND if you are someone with a diagnosis of dementia, or an informal carer such as a family member, partner or friend.
              </p>
              <p>
                There {options.length === 1 ? "is" : "are"} currently <strong>{count} {options.length === 1 ? "way" : "ways"}</strong> to get involved. Choose an option below to find out more.
              </p>
            </div>

            <InvolvementOptions options={options} />

            <p className={styles.smallprint}>
              Not sure which is right for you? Email us at <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default ParticipatePage
