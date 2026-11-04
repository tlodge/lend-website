import styles from "./TeamMembers.module.css"
import type { TeamMember } from "../lib/types"

interface TeamMembersProps {
  members: TeamMember[];
  compact?: boolean;
}

export default function TeamMembers({ members, compact = false }: TeamMembersProps) {
  return (
    <ul className={`${styles.grid} ${compact ? styles.compact : ""}`}>
      {members.map((member) => (
        <li key={member.name} className={styles.member}>
          <h3 className={styles.name}>
            {member.url ? (
              <a href={member.url} target="_blank" rel="noopener noreferrer">
                {member.name}<span className={styles.visuallyHidden}> (staff profile, opens in a new tab)</span>
              </a>
            ) : member.name}
          </h3>
          {(member.title || member.institution) && (
            <p className={styles.meta}>
              {[member.title, member.institution].filter(Boolean).join(" · ")}
            </p>
          )}
          {member.role && !compact && <p className={styles.role}>{member.role}</p>}
        </li>
      ))}
    </ul>
  )
}
