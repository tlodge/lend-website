import styles from "./AboutContent.module.css"
import peopleData from "../app/data/people.json"
import type { PeopleData } from "../lib/types"

export default function TeamContent() {
  const teamMembers: PeopleData = peopleData as PeopleData;

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.whoWeAre}>

          <div className={styles.teamMembers}>


            <div className={styles.teamGrid}>
              {teamMembers.map((person, index) => (
                <div key={index} className={styles.teamMemberContent}>
                  <div className={styles.memberHeader}>
                    <h3><a href={person.url || ""} target="_blank" rel="noopener noreferrer">{person.name}</a></h3>
                    <h4>{person.institution}</h4>
                  </div>
                  <div className={styles.memberBody}>
                    <div className={styles.profileInfo}>
                      <p className={styles.profileText}>{person.profile}</p>
                    </div>
                    {person.image && (
                      <div className={styles.imageContainer}>
                        <img src={person.image} alt={person.name} className={styles.profileImage} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
