export const EVENT_TYPES = {
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  PAGE_VIEW: 'page_view',
  BUTTON_PRESS: 'button_press',
} as const;

export const SCREEN_IDS = {
  WELCOME: 'welcome',
  USER_TYPE: 'user_type',
  CONCEPT_CHOICE: 'concept_choice',
  CONCEPT_A_THEME: 'concept_a_theme',
  CONCEPT_A_FORMAT: 'concept_a_format',
  CONCEPT_B_EXAMPLE: 'concept_b_example',
  CONCEPT_C_QUESTION_1: 'concept_c_question_1',
  CONCEPT_C_QUESTION_2: 'concept_c_question_2',
  EXCLUDE: 'exclude',
  DELIVERY_CHANNEL: 'delivery_channel',
  DELIVERY_FREQUENCY: 'delivery_frequency',
  DELIVERY_TIME: 'delivery_time',
  ADDITIONAL_OPTIONS: 'additional_options',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation',
  UNKNOWN: 'unknown',
} as const;

const SCREEN_ID_BY_PATH: Record<string, string> = {
  '/': SCREEN_IDS.WELCOME,
  '/user-type': SCREEN_IDS.USER_TYPE,
  '/concept-choice': SCREEN_IDS.CONCEPT_CHOICE,
  '/concept-a': SCREEN_IDS.CONCEPT_A_THEME,
  '/format': SCREEN_IDS.CONCEPT_A_FORMAT,
  '/concept-b': SCREEN_IDS.CONCEPT_B_EXAMPLE,
  '/concept-c': SCREEN_IDS.CONCEPT_C_QUESTION_1,
  '/concept-c/question2': SCREEN_IDS.CONCEPT_C_QUESTION_2,
  '/exclude': SCREEN_IDS.EXCLUDE,
  '/channel': SCREEN_IDS.DELIVERY_CHANNEL,
  '/frequency': SCREEN_IDS.DELIVERY_FREQUENCY,
  '/time': SCREEN_IDS.DELIVERY_TIME,
  '/options': SCREEN_IDS.ADDITIONAL_OPTIONS,
  '/review': SCREEN_IDS.REVIEW,
  '/confirmation': SCREEN_IDS.CONFIRMATION,
};

export function getScreenIdFromPath(pathname: string): string {
  return SCREEN_ID_BY_PATH[pathname] ?? SCREEN_IDS.UNKNOWN;
}