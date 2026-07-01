const SHARED_SCREEN_IDS = ["summaryAvoid", "summaryAgree", "frequency", "time", "finalReview", "allDone"];
export const STORY_EXAMPLE_LIMIT = 3;
const MULTI_SELECT_SUBTITLE = "Choose as many as you like (or none!)";
const SINGLE_SELECT_SUBTITLE = "Please choose just one (or none!)";
export const USER_TYPES = [
  "a carer",
  "a person with dementia guided",
  "a person with dementia unguided"
];

export const FLOW_ORDERS = [
  { id: "A-B", label: "Approach A -> Approach B -> Shared", sequence: ["A", "B", "S"] },
  { id: "B-A", label: "Approach B -> Approach A -> Shared", sequence: ["B", "A", "S"] }
];

export const STORY_CARD_CONTENT = [
  {
    id: "story-1",
    title: "Finding support after diagnosis",
    imageLabel: "Photo 1",
    description: "A person reflects on the early weeks after diagnosis and the kinds of support that felt most helpful."
  },
  {
    id: "story-2",
    title: "Making space for everyday routines",
    imageLabel: "Photo 2",
    description: "A short story about holding on to familiar routines, small pleasures, and a sense of steadiness each day."
  },
  {
    id: "story-3",
    title: "Family conversations changing over time",
    imageLabel: "Photo 3",
    description: "A person describes how conversations with family shifted, and what helped those relationships feel easier."
  }
];

export const APPROACH_A_SCREENS = [
  {
    id: "a-intro",
    type: "info",
    body: "On the next screens we will ask some questions about the stories you would like to receive. You can skip any question."
  },
  {
    id: "a-topics",
    type: "options",
    question: "What would you like the stories to be about?",
    subtitle: MULTI_SELECT_SUBTITLE,
    optionsByUserType: {
      Carer: [
        "Being diagnosed with dementia",
        "How people live with dementia",
        "Family and relationships",
        "Planning for the future",
        "The challenges of caring for a person with dementia",
        "Perceptions from others and stigma",
        "Campaigns and rights",
        "Support and social care",
        "I don’t know"
      ],
      "Person with dementia": [
        "Being diagnosed with dementia",
        "How people live with dementia",
        "Dementia and working",
        "Family and relationships",
        "Hobbies, interests and everyday life",
        "Perceptions from others and stigma",
        "Campaigns and rights",
        "I don’t know"
      ]
    },
    textarea: {
      key: "topicsOther",
      placeholder: "something else"
    },
  },
  {
    id: "a-topics-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
  {
    id: "a-purpose",
    type: "options",
    question: "How would you like stories to help you?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Help me understand dementia",
      "Give practical advice",
      "Show support and reassurance",
      "Feel positive or hopeful",
      "Help me relax or take my mind off things",
      "I don’t know"
    ],
    textarea: {
      key: "topicsOther",
      placeholder: "something else"
    },
  },
  {
    id: "a-purpose-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
  {
    id: "a-tone",
    type: "options",
    question: "How would you like stories to feel?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Comforting / uplifting",
      "Honest and realistic",
      "Light-hearted",
      "Informative",
      "I don’t know"
    ]
  },
  {
    id: "a-tone-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
  {
    id: "a-relatable",
    type: "options",
    question: "Would it help to hear stories from people who feel similar to you?",
    subtitle: SINGLE_SELECT_SUBTITLE,
    options: ["Yes", "No", "Not sure"],
    mutex: [["Yes", "No", "Not sure"]]
  },
  {
    id: "a-narrator",
    type: "options",
    question: "What kind of person would you prefer to tell the story?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Someone my age",
      "Someone with a similar background or culture",
      "Someone with similar experiences",
      "Someone different to me",
      "I don’t mind",
      "I don’t know"
    ],
    mutex: [["Someone different to me", "Someone with similar experiences"], ["Someone different to me", "Someone with a similar background or culture"], ["Someone different to me", "Someone my age"]],
  },
  {
    id: "a-summary-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
];

export const APPROACH_B_SCREENS = [
  {
    id: "b-intro",
    type: "info",
    body:
      "On the next screens we will ask some simple questions to help us find you some stories. You can skip any question."
  },
  {
    id: "b-important-people",
    type: "options",
    question: "Who are the people most important in your life?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Family",
      "Friends",
      "Partner",
      "People I spend time with",
      "Community or group",
      "Prefer not to say"
    ]
  },
  {
    id: "b-identity",
    type: "options",
    question: "Are there parts of your background that are important to you?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Language I speak",
      "Religion or belief",
      "Cultural background",
      "Traditions or celebrations",
      "Food or cooking",
      "Music or cultural activities",
      "Prefer not to say"
    ],
    textarea: {
      key: "topicsOther",
      placeholder: "something else"
    }
  },
  {
    id: "b-identity-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
  {
    id: "b-day",
    type: "options",
    question: "What is a normal day like for you?",
    subtitle: MULTI_SELECT_SUBTITLE,
    mutex: [["Most days are the same", "Different every day"]],
    options: [
      "At home",
      "With family",
      "Out and about",
      "Quiet time",
      "Watching / listening to things",
      "Most days are the same",
      "Different every day",
      "At work",
      "Prefer not to say"
    ],
    textarea: {
      key: "bdayOther",
      placeholder: "something else"
    },
  },
  {
    id: "b-enjoy",
    type: "options",
    question: "What kinds of things do you enjoy?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Talking and socialising with people",
      "Watching TV / films",
      "Listening to stories",
      "Hobbies (e.g. gardening, crafts)",
      "Learning new things",
      "Prefer not to say"
    ]
  },
  {
    id: "b-enjoy-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  },
  {
    id: "b-places",
    type: "options",
    question: "Are there places that are particularly special to you?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "Home",
      "A place of worship",
      "Where I grew up",
      "A place from the past",
      "Holidays",
      "A particular country or culture",
      "Prefer not to say"
    ],
    textarea: {
      key: "topicsOther",
      placeholder: "somewhere else"
    },
  },
  {
    id: "b-day-to-day",
    type: "options",
    question: "Which of these describe your day-to-day life, now or in the past?",
    subtitle: MULTI_SELECT_SUBTITLE,
    mutex: [["Not working at the moment", "Working in a job"]],
    options: [
      "Working in a job",
      "Looking after family or home",
      "Caring for someone",
      "Volunteering or helping others",
      "Retired",
      "Not working at the moment",
      "Prefer not to say"
    ]
  },
  {
    id: "b-carer-role",
    type: "options",
    question: "What is your role in caring for or supporting someone?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: [
      "I provide daily care",
      "I help regularly",
      "I support occasionally",
      "I mainly help make decisions",
      "I used to provide care but not anymore",
    ],
    onlyForUserType: "Carer"
  },
  {
    id: "b-summary-example",
    type: "stories",
    body:
      "Based on what you’ve told us so far, here are some example stories."
  }
];

export const SHARED_SCREENS = [
  {
    id: "summaryIntro",
    type: "info",
    body: "Thank you, you have finished the second task. A researcher will ask you a few more questions and then we will do the final task"
  },
  {
    id: "summaryFinal",
    type: "info",
    body: "In this final task, we would like to ask a few more questions about your preferences for receiving stories"
  },
  {
    id: "summaryAvoid",
    type: "summaryAvoid",
    question: "Are there any stories you would not like to receive?",
    subtitle: MULTI_SELECT_SUBTITLE,
    textarea: {
      key: "summaryAvoidOther",
      placeholder: "something else"
    },
    options: [
      "Sad or upsetting stories",
      "Stories about the future getting worse",
      "Long or detailed stories",
      "Lots of reading",
      "Stories that don’t relate to you",
      "I don’t know / Prefer not to say"
    ]
  },

  {
    id: "frequency",
    type: "options",
    selectionMode: "single",
    question: "How often would you like to receive stories?",
    subtitle: SINGLE_SELECT_SUBTITLE,
    options: ["Once a day", "A few times a week", "Once a week", "I don’t know"]
  },
  {
    id: "time",
    type: "options",
    question: "What time of day would you like to receive stories?",
    subtitle: SINGLE_SELECT_SUBTITLE,
    options: ["Morning", "Afternoon", "Evening", "When I ask for one", "I don’t know"]
  },
  {
    id: "format",
    type: "options",
    question: "How would you like to watch, listen to or read stories?",
    subtitle: MULTI_SELECT_SUBTITLE,
    options: ["As audio", "As video", "As text", "As pictures and images", "I don’t know"]
  },
  {
    id: "allDone",
    type: "allDone",
    question: "All done. Thank you so much for taking part",
    subtitle: ""
  }
];

/*{
    id: "finalReview",
    type: "finalReview",
  question: "Review your preferences",
  subtitle: MULTI_SELECT_SUBTITLE
  },*/
export function getFlowScreens(approach, userType) {
  const flowScreens =
    approach === "S" ? SHARED_SCREENS :
      approach === "A" ? APPROACH_A_SCREENS : APPROACH_B_SCREENS;

  return [...flowScreens].filter((screen) => {
    if (screen.onlyForUserType && screen.onlyForUserType === "Carer" && userType !== "a carer") {
      return false;
    }

    return true;
  });
}

export function getOptionsForScreen(screen, userType) {
  if (screen.optionsByUserType) {
    const approachAUserType =
      userType === "a carer" ? "Carer" : "Person with dementia";
    return screen.optionsByUserType[approachAUserType] || [];
  }

  return screen.options || [];
}

export function isExclusiveOption(option) {
  return option === "I don’t know" ||
    option === "Prefer not to say" ||
    option === "I don’t know / Prefer not to say";
}

export function isSharedScreen(screenId) {
  return SHARED_SCREEN_IDS.includes(screenId);
}

export function getTextareaResponseKey(screen) {
  if (!screen?.textarea) {
    return null;
  }

  return screen.textarea.key || `${screen.id}Other`;
}
