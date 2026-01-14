import styles from "./AboutContent.module.css"
import peopleData from "../app/data/people.json"
import type { PeopleData } from "../lib/types"

export default function AboutContent() {
  const teamMembers: PeopleData = peopleData as PeopleData;
  
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.aboutProject}>
            <h2>About the LEND project</h2>
            <p>
              Research shows that personal stories can improve coping and wellbeing.
            </p>
            <p>
              Building on the successful <a href="https://www.researchintorecovery.com/research/neon/">NEON</a> study in mental health, this project will develop the Lived Experience
              Narratives in Dementia (LEND) Intervention, an online platform of diverse first-person stories from people
              with dementia and carers. Stories will be safely collected, culturally tailored, and accessible via text,
              audio, and video, with filters to help users find personally meaningful accounts.
            </p>
            <p>
              Two clinical trials will evaluate LEND&apos;s benefits and cost-effectiveness for people with dementia and
              their carers. A Lived Experience Advisory Panel will co-develop the intervention, ensuring cultural
              competence, relevance, and impact.
            </p>
          </div>

          <div className={styles.whoWeAre}>
            <h2>Who we are</h2>
            <p>
              We are a mix of academics, clinical psychologists, psychiatrists, economists, statisticians,
              technologists, and people with lived experience of dementia. The project lead is Professor Martin Orrell,
              who is the Director of the Institute of  Mental Health at the University of Nottingham. 
            </p>
            <div className={styles.teamMembers}>
            
            
            <div className={styles.teamGrid}>
              {teamMembers.map((person, index) => (
                <div key={index} className={styles.teamMember}>
                  <h3><a href={person.url || ""} target="_blank" rel="noopener noreferrer">{person.name}</a></h3>
                  <h4>{person.institution}</h4>
                  <p>{person.profile}</p>
                </div>
              ))}
            </div>
          </div>
          </div>

          
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.projectDetails}>
            <div className={styles.detailItem}>
              <h3>The Project started</h3>
              <p>June 2024</p>
            </div>

            <div className={styles.detailItem}>
              <h3>The Project will end</h3>
              <p>May 2029</p>
            </div>

            <div className={styles.detailItem}>
              <h3>NIHR award ID</h3>
              <p>
                <a href="https://fundingawards.nihr.ac.uk/award/NIHR206255" target="_blank" rel="noopener noreferrer">
                  NIHR206255
                </a>
              </p>
            </div>

            <div className={styles.detailItem}>
              <h3>Contracting Organisation</h3>
              <p>
                <a href="https://www.nottinghamshirehealthcare.nhs.uk/" target="_blank" rel="noopener noreferrer">
                  Nottingham Healthcare NHS Trust
                </a>
              </p>
            </div>

            <div className={styles.detailItem}>
              <h3>Project Partners</h3>
              <ul>
                <li>
                  <a href="https://www.nottingham.ac.uk/" target="_blank" rel="noopener noreferrer">
                    University of Nottingham
                  </a>
                </li>
                <li>
                  <a href="https://www.uwl.ac.uk/" target="_blank" rel="noopener noreferrer">
                    University of West London
                  </a>
                </li>
                <li>
                  <a href="https://le.ac.uk/" target="_blank" rel="noopener noreferrer">
                    University of Leicester
                  </a>
                </li>
                <li>
                  <a href="https://www.bangor.ac.uk/" target="_blank" rel="noopener noreferrer">
                    Bangor University
                  </a>
                </li>
                <li>
                  <a href="https://www.exeter.ac.uk/" target="_blank" rel="noopener noreferrer">
                    University of Exeter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
