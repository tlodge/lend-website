"use client";

import { useState } from "react";
import PrototypeApp from "./PrototypeApp";
import styles from "./RemoteEntry.module.css";
import Link from "next/link";

function splitTrailingPunctuation(value) {
  let link = value;
  let trailing = "";

  while (/[),.;:!?]$/.test(link)) {
    trailing = link.slice(-1) + trailing;
    link = link.slice(0, -1);
  }

  return { link, trailing };
}

function linkifyPlainText(text) {
  const urlPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

  const withUrls = text.replace(urlPattern, (match) => {
    const { link, trailing } = splitTrailingPunctuation(match);
    const href = link.startsWith("http") ? link : `https://${link}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${link}</a>${trailing}`;
  });

  return withUrls.replace(emailPattern, (match) => {
    const { link, trailing } = splitTrailingPunctuation(match);
    return `<a href="mailto:${link}">${link}</a>${trailing}`;
  });
}

function linkifyHtml(html) {
  const segments = html.split(/(<[^>]+>)/g);
  return segments
    .map((segment) => (segment.startsWith("<") ? segment : linkifyPlainText(segment)))
    .join("");
}

const PARTICIPANT_INFO_SECTIONS = [
  {
    id: "who",
    title: "Who are we?",
    paragraphs: [
      "We are researchers from the University of Nottingham, University of West London, University of Bangor, University of Leicester and the University of Essex who contribute to the <strong>Lived Experience Narratives in Dementia (LEND) Programme.</strong>",
      "This study is part of our ongoing work to develop an online resource using real-life stories from people living with dementia and carers to help other people living with dementia and carers.",
      "The LEND Programme research study is being sponsored by Nottinghamshire Healthcare NHS Foundation Trust.",
    ],
  },
  {
    id: "why",
    title: "Why are we doing this research?",
    paragraphs: [
      "We are designing and testing a new digital tool, called the <strong>Online LEND Intervention</strong>, that shares personal stories from people affected by dementia.",
      "Your feedback will help us make sure it is useful, easy to use, and emotionally supportive.",
    ],
  },
  {
    id: "invited",
    title: "Why have I been invited?",
    paragraphs: [
      "You have been invited because we have designed and developed a version of the Online LEND Intervention and would like your feedback on it.",
      "Because this part of the LEND Programme is about developing an online intervention, you will be guided by researchers, so it is important that you can communicate in English with the researchers.",
      "Participation in the LEND research study is voluntary. Please read this participant information sheet to help you decide. If you have any questions, please contact the LEND research team using the contact details on this page.",
    ],
    list: [
      "You are an adult, over 18 years of age.",
      "You have lived experience of dementia, either personally, with a diagnosis of dementia, or as a carer.",
    ],
  },
  {
    id: "what",
    title: "What will I need to do?",
    paragraphs: [
      "We will ask you to use a website that will ask you a set of questions about stories that you would like to read, watch or listen to. We will ask you a few questions about how easy it is to use, as well as share your views on what works well and what could be improved. This will be face to face, either in-person or using Microsoft Teams and a LEND researcher will guide you through the process.",
      "These sessions will be recorded and are likely to last about 30 to 45 minutes. We may invite you to more Workshops in the future, depending on where about we are in the development of the final Online LEND Intervention, the LEND Portal and the LEND Website.",
      "If you would like to take part but are unable to attend in person, this can be done online or face to face at a different location. Please speak to the LEND team on <strong>07791598280</strong> or email <strong>LEND@nottingham.ac.uk</strong>.",
    ],
  },
  {
    id: "information",
    title: "How will you use my information?",
    paragraphs: [
      "LEND researchers will collect and store information about you so we can contact you about the study, manage your consent, and link your unique identifier (UID) code to your activity data.",
      "This personal information will include your name, contact details, and consent form. All identifiable information will be stored securely within the Trust’s IT environment and will only be accessible to authorised members of the LEND research team.",
      "Details on your consent form, such as your name, email address, and mobile phone number will be stored securely within the University of Nottingham’s IT environment and only authorised members of the research team will be able to access it.",
      "The recordings from this study will be written out (transcribed) and any information that can identify you or anyone else will be removed (anonymised). This means the transcript will include your UID instead of your name.",
      "We will keep a code file so we can link your UID to your data. This enables us to contact you again, so we can ask you to check any modifications we have made to the Intervention. We will keep the code file separate from all the other data and access to it will be restricted to key researchers only.",
      "The code file will be destroyed at the end of this part of the LEND research project and no one else will know who took part.",
      "Any personal data you choose to share with us when using the Online LEND Intervention will be linked to your UID code and kept in the University of Nottingham’s secure IT environment.",
      "Only anonymised quotes or other anonymous information gained from you may be used in the dissemination of our findings.",
    ],
  },
  {
    id: "confidential",
    title: "Will my data be kept confidential?",
    paragraphs: [
      "Yes.",
      "Your information will be securely stored and managed under UK GDPR and the Data Protection Act 2018. Only members of the LEND research team and authorised bodies will access your data.",
      "The lawful bases for processing data during the LEND research project are Article 6(1)(e) and Article 9(2)(j).",
      "Further information about how the Trust processes personal data can be found in the Privacy Notice on the Trust website. If you have any questions about how your personal data is processed by the Trust, you can contact the Information Governance Team: informationgovernance@nottshc.nhs.uk.",
      "During this phase of the LEND research project, your name and contact details will be stored within the University of Nottingham’s secure IT environment for the purposes outlined in this participant information sheet. A digital copy of your consent form will be initially stored by the University of Nottingham secure IT environment and then transferred to the Trust’s secure IT environment. All other data will be securely stored within the University of Nottingham’s secure IT environment.",
      "We may need to share your data if there is a legal or safeguarding reason to do so, for example, something that indicates a risk of harm to yourself or others or a court order. If we are asked to share your data for any other purpose, we would seek your permission first.",
      "At the end of the LEND research study, all data will be anonymised and securely stored within the Trust’s IT environment for a period of five years after which it will be permanently destroyed.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paragraphs: [
      "You have the legal right to access a copy of the information held about you, correct any inaccurate information, and request deletion of your contact details at any time.",
      "Because your activity data will be anonymised, most of these rights will not apply to the research data itself once identifiers have been removed.",
      "To exercise these rights, or to ask any questions about how your information is used, please contact the Trust’s Information Governance Team: informationgovernance@nottshc.nhs.uk.",
      "You can also read more about how the Trust uses information and your rights at https://www.nottinghamshirehealthcare.nhs.uk/.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing your information",
    paragraphs: [
      "We will not collect any personal data from you in this work package. However, anonymised research data will be shared with partner universities (University of Nottingham, University of West London, University of Exeter, University of Bangor) for analysis, and with collaborators for legitimate research purposes only.",
      "You will not be identifiable in any outputs.",
    ],
  },
  {
    id: "benefits",
    title: "What are the possible benefits?",
    paragraphs: [
      "You will be paid £20 for taking part.",
      "If you are currently receiving means-tested benefits, such as Carer’s Allowance, Pension Credit, or Universal Credit, please be aware that payments you receive for taking part in this study could affect your benefits. To avoid any problems, we recommend letting the DWP know if you are paid for your involvement in the study.",
      "There are no known health benefits to taking part. However, you will be helping shape an online tool that is designed to support people living with dementia. This could improve emotional wellbeing for you and others in the future.",
    ],
  },
  {
    id: "risks",
    title: "Are there any risks?",
    paragraphs: [
      "If listening to or hearing other people’s narratives about living with dementia makes you feel distressed, please tell us, and we will offer to pause or conclude the process.",
      "If you continue to feel distressed afterwards, you might wish to consult the following services for support: your GP, NHS 111, Samaritans, or the Alzheimer’s Society Dementia Support Line.",
    ],
    list: [
      "Your GP – for advice, mental health support, or referral to further services.",
      "NHS 111 – for 24/7 health advice by phone or online: www.111.nhs.uk",
      "Samaritans – free, confidential support, 24 hours a day: call <strong>116 123</strong> or visit www.samaritans.org",
      "Alzheimer’s Society Dementia Support Line – for emotional and practical support: <strong>0333 150 3456</strong> or www.alzheimers.org.uk",
    ],
  },
  {
    id: "wrong",
    title: "What if something goes wrong?",
    paragraphs: [
      "If something goes wrong or if you have any concerns about the way the research is being conducted or how you have been treated, please speak with a member of the research team in the first instance: LEND@nottingham.ac.uk.",
      "If you would prefer to speak with someone independent of the research team, you can contact Research and Evidence (R&E), Nottinghamshire Healthcare NHS Foundation Trust by emailing researchsponsor@nottshc.nhs.uk.",
      "If you wish to complain about any part of this research, you can contact the Research and Evidence Department at Nottinghamshire Healthcare NHS Foundation Trust, who will support you with your concern. You can also raise a complaint through the Trust’s Patient Advice and Liaison Service (PALS) and Complaints Department by telephone (0115) 993 4542, emailing PALSandComplaints@nottshc.nhs.uk or writing to PALS and Complaints, Highbury Hospital, Highbury Road, Nottingham, NG6 9DR.",
      "You can also contact the Information Commissioner’s Office:<br /><strong>Information Commissioner’s Office</strong><br />Wycliffe House<br />Water Lane<br />Wilmslow<br />Cheshire<br />SK9 5AF<br />Telephone:<strong> 0303 123 1113</strong>.",
    ],
  },
  {
    id: "withdraw",
    title: "Can I withdraw?",
    paragraphs: [
      "Yes. You can withdraw at any time without giving a reason and without there being any negative impact for you or, if applicable, the person you care for.",
      "We will anonymise and retain any data collected up to that point. We may include this data in our analysis, but no one will know you have taken part, and we won’t collect any additional information.",
    ],
  },
  {
    id: "funding",
    title: "Who is funding and reviewing this research?",
    paragraphs: [
      "This study is funded by the National Institute for Health and Care Research (NIHR) and sponsored by Nottinghamshire Healthcare NHS Foundation Trust.",
      "It has been reviewed by an independent Research Ethics Committee (IRAS Project ID: 351969).",
    ],
  },
  {
    id: "tracking",
    title: "Keeping track of the LEND Programme",
    paragraphs: [
      "Everyone will be able to access the LEND website, www.dementianarratives.org, which will be kept updated with the LEND findings on a periodic basis.",
      "If you see other parts of the LEND Programme that you would be interested in taking part, please contact LEND via email at LEND@nottingham.ac.uk or the mobile number <strong>07791598280</strong>.",
    ],
  },
  {
    id: "contact",
    title: "Further Information and Contact Details",
    paragraphs: [
      "If you would like further information about other LEND Programme activities, LEND Programme findings so far, or other ways to be involved, please visit the LEND website: www.dementianarratives.org.",
      "If you would like to ask any further questions, please email LEND@nottingham.ac.uk or contact the LEND Programme Manager, Dr Linda O’Raw, by email at linda.oraw@nottingham.ac.uk or via phone: <strong>07791598280</strong>.",
    ],
  },
];

const PARTICIPANT_INFO_NAV = PARTICIPANT_INFO_SECTIONS.map(({ id, title }) => ({ id, title }));

export function ParticipantInformationScreen({ onBack, onGoToStudy }) {
  return (
    <main className={styles.infoShell}>
      <article className={styles.infoPage}>
        <header className={styles.infoHeader}>
          <p className={styles.infoEyebrow}>Participant Information Sheet</p>
          <h1 className={styles.infoTitle}>The LEND Programme: Online Participant Information</h1>
          <p className={styles.infoMeta}>V1.0 • 22nd September 2025 • IRAS Project ID: 351969</p>
          <p className={styles.infoLead}>
            Please read this information before you consent to take part. It explains what the study is about, what you will do, how your information will be used, and who to contact if you have questions. You can download the participant information sheet <Link href="/documents/LEND_participant_information_sheet.docx" target="_blank" rel="noopener noreferrer">here</Link>.
          </p>
        </header>

        <div className={styles.infoSections}>
          {PARTICIPANT_INFO_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className={styles.infoSection}>
              <h2 className={styles.infoSectionTitle}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.infoParagraph} dangerouslySetInnerHTML={{ __html: linkifyHtml(paragraph) }} />
              ))}
              {section.list ? (
                <ul className={styles.infoList}>
                  {section.list.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: linkifyHtml(item) }} />
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
      <div className={`${styles.infoActions} ${styles.infoActionsFixed}`}>
        <button type="button" className={styles.secondaryButton} onClick={onBack}>
          Back
        </button>
        {onGoToStudy ? (
          <button type="button" className={styles.primaryButton} onClick={onGoToStudy}>
            Go to study
          </button>
        ) : null}
      </div>
    </main>
  );
}

export default function RemoteEntry({ studyBasePath = "" }) {
  const [stage, setStage] = useState("splash");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const participantInfoHref = studyBasePath ? `${studyBasePath}/pis` : "/pis";

  if (stage === "intervention") {
    return <PrototypeApp deploymentMode="remote" />;
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <h1 className={styles.title}>The LEND usability study</h1>
        <p className={styles.body}>
          Thank you for taking part in this usability study, which is part of the <Link href="https://dementianarratived.org">LEND project</Link>. Please make sure you have read and understood the Participant Information Sheet before continuing. You can view it <Link href={participantInfoHref}>here.</Link> 
        </p>
        <p className={styles.body}>
         Before continuing, a researcher will go through the <Link href="/documents/consent.docx">consent form</Link> with you, and once you have provided your consent will you be able to take part in the study.
        </p>
        <label className={styles.consentCheckLabel}>
          <input
            type="checkbox"
            checked={consentConfirmed}
            onChange={(event) => setConsentConfirmed(event.target.checked)}
          />
          <span>I have provided my consent</span>
        </label>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setStage("intervention")}
          disabled={!consentConfirmed}
        >
          Start the study
        </button>
      </section>
    </main>
  );
}