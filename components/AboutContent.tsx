import styles from "./AboutContent.module.css"

export default function AboutContent() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.aboutProject}>
            <h2>About the LEND project</h2>
            <p>
              Dementia affects over 850,000 people in the UK and 700,000 carers, often leading to loss of identity,
              reduced quality of life, and "excess disability."
            </p>
            <p>
              Support gaps are particularly stark for disadvantaged and minority groups. Research shows that personal
              stories can improve coping and wellbeing.
            </p>
            <p>
              Building on the successful NEON study in mental health, this project will develop the Lived Experience
              Narratives in Dementia (LEND) Intervention, an online platform of diverse first-person stories from people
              with dementia and carers. Stories will be safely collected, culturally tailored, and accessible via text,
              audio, and video, with filters to help users find personally meaningful accounts.
            </p>
            <p>
              Two clinical trials will evaluate LEND's benefits and cost-effectiveness for people with dementia and
              their carers. A Lived Experience Advisory Panel will co-develop the intervention, ensuring cultural
              competence, relevance, and impact.
            </p>
          </div>

          <div className={styles.whoWeAre}>
            <h2>Who we are</h2>
            <p>
              We are a mix of academics, clinical psychologists, psychiatrists, economists, statisticians,
              technologists, and people with lived experience of dementia. The project lead is Professor Martin Orel,
              who is the Director of the Institute at the University of Nottingham. More information on each member of
              the team can be found here.
            </p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.projectDetails}>
            <div className={styles.detailItem}>
              <h3>The Project started</h3>
              <p>June 2024</p>
            </div>

            <div className={styles.detailItem}>
              <h3>The Project will ends</h3>
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
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    University of Nottingham
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    University of West London
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    University of Leicester
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Bangor University
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
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
