import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import BackLink from "../../components/BackLink"
import TeamMembers from "../../components/TeamMembers"
import styles from "../../components/PageLayout.module.css"
import teamStyles from "./page.module.css"
import teamData from "../data/team.json"
import type { TeamData } from "../../lib/types"

export const metadata = {
  title: "Our team – LEND",
}

export default function TeamPage() {
  const { groups, universities } = teamData as TeamData
  const contacts = groups.flatMap((group) => group.members).filter((member) => member.contact)

  return (
    <main>
      <Header />
      <div className="content-container">
        <div className={`${styles.page} ${styles.teal}`}>
          <h1 className={styles.banner}>Our team</h1>

          <div className={styles.column}>
            <div className={styles.intro}>
              <p>
                LEND brings together academics, clinical psychologists, psychiatrists, economists, statisticians, technologists and people with lived experience of dementia from five universities.
              </p>
            </div>

            <section className={`${styles.section} ${teamStyles.contact}`}>
              <h2 className={styles.sectionTitle}>Taking part? Who you may hear from</h2>
              <div className={styles.prose}>
                <p>
                  If you take part in LEND, these are the people most likely to be in touch with you about recruitment, interviews and data collection, and to answer your questions.
                </p>
              </div>
              <div className={teamStyles.contactList}>
                <TeamMembers members={contacts} compact />
              </div>
              <p className={teamStyles.contactEmail}>
                To get in touch, email <a href="mailto:LEND@nottingham.ac.uk">LEND@nottingham.ac.uk</a>
              </p>
            </section>

            {groups.map((group) => (
              <section key={group.id} className={styles.section} aria-labelledby={`group-${group.id}`}>
                <h2 id={`group-${group.id}`} className={styles.sectionTitle}>{group.title}</h2>
                <TeamMembers members={group.members} />
              </section>
            ))}

            <section className={styles.section} aria-labelledby="group-universities">
              <h2 id="group-universities" className={styles.sectionTitle}>Collaborating universities</h2>
              <ul className={teamStyles.universities}>
                {universities.map((university) => (
                  <li key={university.name} className={teamStyles.university}>
                    <h3 className={teamStyles.universityName}>{university.name}</h3>
                    <p className={teamStyles.universityText}>{university.contribution}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section} aria-labelledby="group-abbreviations">
              <h2 id="group-abbreviations" className={styles.sectionTitle}>Abbreviations</h2>
              <dl className={teamStyles.glossary}>
                <dt>WP1–WP5</dt>
                <dd>The five work packages that LEND is organised into</dd>
                <dt>PPIE</dt>
                <dd>Patient and public involvement and engagement</dd>
                <dt>LEAP</dt>
                <dd><Link href="/leap">Lived Experience Advisory Panel</Link></dd>
                <dt>DCE</dt>
                <dd>Discrete choice experiment</dd>
                <dt>NWORTH CTU</dt>
                <dd>North Wales Organisation for Randomised Trials in Health, the clinical trials unit at Bangor University</dd>
                <dt>NEON</dt>
                <dd>Narrative Experiences Online, an earlier research programme on mental health recovery narratives</dd>
              </dl>
            </section>

            <BackLink />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
