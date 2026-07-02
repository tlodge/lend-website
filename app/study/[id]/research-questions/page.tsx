import Link from "next/link";
import {
  getQuestionSection,
  RESEARCH_QUESTION_CONTENT,
  RESEARCH_QUESTION_ORDER,
} from "../data/researchQuestions";
import BackLinkButton from "./BackLinkButton";
import styles from "./page.module.css";

type ResearchQuestionsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResearchQuestionsPage({
  params,
  searchParams,
}: ResearchQuestionsPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const sectionParam = resolvedSearchParams.section;
  const requestedSection =
    Array.isArray(sectionParam) ? sectionParam[0] : sectionParam || "pre-task";
  const section = getQuestionSection(requestedSection);

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Researcher Guide</p>
          <h1 className={styles.title}>Study Question Prompts</h1>
          <p className={styles.intro}>
            Use these prompts at each stage of the study. They are semi-structured and
            can be adapted naturally during conversation.
          </p>
        </header>

        <nav className={styles.nav} aria-label="Question stage links">
          {RESEARCH_QUESTION_ORDER.map((sectionId) => {
            const item = RESEARCH_QUESTION_CONTENT[sectionId];
            const isActive = section.id === sectionId;
            return (
              <Link
                key={sectionId}
                href={`/study/${id}/research-questions?section=${sectionId}`}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {item.navLabel}
              </Link>
            );
          })}
        </nav>

        <article className={styles.card}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <p className={styles.sectionIntro}>{section.intro}</p>

          <div className={styles.groupStack}>
            {section.groups.map((group) => (
              <section key={group.title} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                <ol className={styles.questionList}>
                  {group.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </article>

        <BackLinkButton />
      </section>
    </main>
  );
}
