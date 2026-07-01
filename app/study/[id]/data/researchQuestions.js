export const QUESTION_SECTIONS = {
  PRE_TASK: "pre-task",
  POST_TASK: "post-task",
  POST_STUDY: "post-study"
};

export const RESEARCH_QUESTION_CONTENT = {
  [QUESTION_SECTIONS.PRE_TASK]: {
    id: QUESTION_SECTIONS.PRE_TASK,
    navLabel: "Pre-task questions",
    title: "Pre-study questions (semi-structured)",
    intro:
      "These questions do not need to be asked verbatim, so can be adjusted as appropriate to the participant.",
    groups: [
      {
        title: "Core questions",
        questions: [
          "Do you have or use a smart phone?",
          "Do you use WhatsApp or texting?",
          "Do you use any websites or apps for help and support with dementia?"
        ]
      },
      {
        title: "Questions specifically for a person with dementia",
        questions: [
          "Do you usually require support from someone else when using your phone or using a website?",
          "Has your phone or computer been set up to make it easier for you to use (for example, accessibility requirements)?"
        ]
      },
      {
        title: "Questions specifically for carers",
        questions: [
          "Do you (or did you) usually need to support the person you care for when they use a phone or a website?"
        ]
      }
    ]
  },
  [QUESTION_SECTIONS.POST_TASK]: {
    id: QUESTION_SECTIONS.POST_TASK,
    navLabel: "Post-task questions",
    title: "Questions to be asked after each task",
    intro:
      "These questions do not need to be asked verbatim, so can be adjusted as appropriate to the participant.",
    groups: [
      {
        title: "After each task",
        questions: [
          "How easy or difficult was this to use?",
          "Were you able to choose the kinds of stories you wanted?",
          "Did anything confuse you?",
          "Did you feel confident about what you had selected?",
          "Was anything missing?"
        ]
      }
    ]
  },
  [QUESTION_SECTIONS.POST_STUDY]: {
    id: QUESTION_SECTIONS.POST_STUDY,
    navLabel: "Post-study questions",
    title: "Questions to be asked at the end of the study",
    intro:
      "These questions do not need to be asked verbatim, so can be adjusted as appropriate to the participant.",
    groups: [
      {
        title: "End of study",
        questions: [
          "Which approach did you prefer?",
          "Which approach was easier?",
          "Which approach helped you express your preferences better?",
          "What did you like about the system?",
          "What did you dislike?",
          "Are there topics you would want to receive?",
          "Are there topics you would not want to receive?"
        ]
      }
    ]
  }
};

export const RESEARCH_QUESTION_ORDER = [
  QUESTION_SECTIONS.PRE_TASK,
  QUESTION_SECTIONS.POST_TASK,
  QUESTION_SECTIONS.POST_STUDY
];

export function getQuestionSection(sectionId) {
  return RESEARCH_QUESTION_CONTENT[sectionId] || RESEARCH_QUESTION_CONTENT[QUESTION_SECTIONS.PRE_TASK];
}