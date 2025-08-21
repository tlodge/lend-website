import styles from "./QuestionsSection.module.css"

const QuestionsSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.questionsRow}>
          <h3 className={styles.question}>What do you wish we all knew about dementia?</h3>
          <h3 className={styles.question}>What stories have helped you?</h3>
          <h3 className={styles.question}>How easy is it to find stories that feel relevant to you?</h3>
        </div>
        <p className={styles.description}>
          In a recent workshop at the University of Nottingham our lived-experience panel chatted about the challenges
          that they face and the stories that have been helpful (and unhelpful!) to them. Find out what we learnt and
          tell us about your own experiences.
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.button}>Share your own insights</button>
        </div>
      </div>
    </section>
  )
}

export default QuestionsSection
