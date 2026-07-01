/**
 * ScreenRenderer
 *
 * Shared rendering logic extracted from PrototypeApp so it can be used
 * both in the live prototype and in the /replay viewer.
 *
 * All interactive callbacks are optional – pass noops for read-only views.
 */
"use client";

import {
  getOptionsForScreen,
  getTextareaResponseKey,
  isExclusiveOption,
  STORY_CARD_CONTENT,
  STORY_EXAMPLE_LIMIT,
} from "../data/flows";
import rulesConfig from "../data/rules.json";
import { selectStories, summarizeSelection } from "../lib/storySelector";
import StoryCard from "./StoryCard";
import styles from "./PrototypeApp.module.css";

const noop = () => {};
const ETHNIC_BACKGROUND_MAP = {
  Asian: "asian",
  "Black/African/Carribean": "black",
  "Dual/Multiple Ethnic group": "mixed",
  "Other ethnic group": "other",
  White: "white",
  "White (e.g. British, Irish, European)": "white",
  "Mixed or multiple ethnic backgrounds": "mixed",
  "Asian or Asian British (e.g. Indian, Pakistani, Bangladeshi, Chinese)": "asian",
  "Black, Black British, Caribbean or African": "black",
  "Other ethnic background": "other",
};
const AGE_BAND_MAP = {
  "Under 40": "under_40",
  "40-59": "40_59",
  "60-79": "60_79",
  "80+": "80_plus",
};
const GENDER_MAP = {
  Female: "female",
  Male: "male",
  Other: "other",
  Woman: "female",
  Man: "male",
  "Non-binary": "non_binary",
};
const SEXUALITY_MAP = {
  "Gay man": "gay_or_lesbian",
  "Lesbian/gay woman": "gay_or_lesbian",
  Other: "other",
  other: "other",
  Heterosexual: "heterosexual",
  "Gay or Lesbian": "gay_or_lesbian",
  Bisexual: "bisexual",
};

function normalizeSetupDemographics(setupDemographics = {}) {
  return {
    ethnicBackground: ETHNIC_BACKGROUND_MAP[setupDemographics.ethnicBackground] || "",
    ageBand: AGE_BAND_MAP[setupDemographics.ageGroup] || "",
    gender: GENDER_MAP[setupDemographics.gender] || "",
    sexuality: SEXUALITY_MAP[setupDemographics.sexuality] || "",
  };
}

function getNarratorTagKeysForUserType(userType = "") {
  const normalized = String(userType || "").toLowerCase();
  if (normalized.includes("person with dementia")) {
    return ["pwd", "pwd_narrator"];
  }
  if (normalized.includes("carer")) {
    return ["carer_narrator"];
  }
  return [];
}

function getStoryAttributeFilters(responses, setupDemographics = {}, userType = "") {
  const relatableAnswers = responses?.["a-relatable"] || [];
  const narratorAnswers = responses?.["a-narrator"] || [];

  if (!relatableAnswers.includes("Yes") || narratorAnswers.length === 0) {
    return { requiredNarratorTagKeys: [], requiredStoryAttributes: [] };
  }

  const narratorAnswer = narratorAnswers[0];
  const attributeRules = rulesConfig.attributeMatchingRules || {};
  const defaultRules = attributeRules.default || {};
  const activatedRules = attributeRules.activatedByNarratorAnswer?.[narratorAnswer] || {};
  const resolvedRules = { ...defaultRules, ...activatedRules };
  const normalized = normalizeSetupDemographics(setupDemographics);
  const requiredNarratorTagKeys = getNarratorTagKeysForUserType(userType);
  const requiredStoryAttributes = [];

  if (requiredNarratorTagKeys.length === 0) {
    return { requiredNarratorTagKeys: [], requiredStoryAttributes: [] };
  }

  if (resolvedRules.useAgeBand && normalized.ageBand) {
    requiredStoryAttributes.push({
      label: "ageBand",
      value: normalized.ageBand,
      tagKeys: requiredNarratorTagKeys,
    });
  }

  if (resolvedRules.useSexuality && normalized.sexuality) {
    requiredStoryAttributes.push({
      label: "sexuality",
      value: normalized.sexuality,
      tagKeys: requiredNarratorTagKeys,
    });
  }

  if (normalized.gender) {
    requiredStoryAttributes.push({
      label: "gender",
      value: normalized.gender,
      tagKeys: requiredNarratorTagKeys,
    });
  }

  if (resolvedRules.useEthnicBackground && normalized.ethnicBackground) {
    requiredStoryAttributes.push({
      label: "ethnicBackground",
      value: normalized.ethnicBackground,
      tagKeys: requiredNarratorTagKeys,
    });
  }

  return { requiredNarratorTagKeys, requiredStoryAttributes };
}

export function renderScreen({
  screen,
  userType,
  responses,
  setupDemographics = {},
  seenStoryIds = [],
  updateSelections = noop,
  updateTextResponse = noop,
  onStoryFeedback = noop,
  onGoToPreviousStory = noop,
  storyCardIndex = 0,
}) {
  if (!screen) return null;

  if (screen.type === "info") {
    return <InfoScreen body={screen.body} />;
  }

  if (screen.type === "stories") {
    return (
      <StoryScreen
        body={screen.body}
        onStoryFeedback={onStoryFeedback}
        onGoToPreviousStory={onGoToPreviousStory}
        storyCardIndex={storyCardIndex}
        responses={responses}
        userType={userType}
        setupDemographics={setupDemographics}
        seenStoryIds={seenStoryIds}
      />
    );
  }

  if (screen.type === "summaryAgree") {
    return (
      <SummaryAgreeScreen
        screen={screen}
        userType={userType}
        responses={responses}
        updateSelections={updateSelections}
        updateTextResponse={updateTextResponse}
      />
    );
  }

  if (screen.type === "summaryAvoid") {
    return (
      <SummaryAvoidScreen
        screen={screen}
        responses={responses}
        updateSelections={updateSelections}
        updateTextResponse={updateTextResponse}
      />
    );
  }

  if (screen.type === "finalReview") {
    return <FinalReviewScreen responses={responses} userType={userType} />;
  }

  if (screen.type === "allDone") {
    return <AllDoneScreen screen={screen} />;
  }

  return (
    <OptionsScreen
      question={screen.question}
      subtitle={screen.subtitle}
      screen={screen}
      responses={responses}
      updateTextResponse={updateTextResponse}
      options={getOptionsForScreen(screen, userType)}
      selectedOptions={responses[screen.id] || []}
      onSelect={(option) => updateSelections(screen.id, option)}
    />
  );
}

// ─── Sub-screens ─────────────────────────────────────────────────────────────

export function InfoScreen({ body }) {
  return <p className={styles.introText}>{body}</p>;
}

export function OptionsScreen({
  question,
  subtitle,
  screen,
  responses,
  updateTextResponse,
  options,
  selectedOptions,
  onSelect,
}) {
  return (
    <div className={styles.contentStack}>
      <h1 className={styles.question}>{question}</h1>
      {subtitle ? <p className={styles.questionSubtitle}>{subtitle}</p> : null}
      <div className={styles.optionsGrid}>
        {options.map((option) => {
          const selected = selectedOptions.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
              onClick={() => onSelect(option)}
              aria-pressed={selected}
            >
              <span className={styles.optionIndicator} aria-hidden="true">
                {selected ? <span className={styles.optionTick}>✓</span> : null}
              </span>
              <span className={styles.optionLabel}>{option}</span>
            </button>
          );
        })}
      </div>
      <OptionalTextarea
        screen={screen}
        responses={responses}
        updateTextResponse={updateTextResponse}
      />
    </div>
  );
}

export function getEffectiveStoryLimit(
  responses,
  seenStoryIds = [],
  setupDemographics = {},
  userType = ""
) {
  const allValues = Object.values(responses).flat();
  const hasNonExclusive = allValues.some(
    (v) => typeof v === "string" && !isExclusiveOption(v)
  );
  if (!hasNonExclusive) return 0;
  const inferred = inferTopDimensions(responses);
  const { requiredNarratorTagKeys, requiredStoryAttributes } = getStoryAttributeFilters(
    responses,
    setupDemographics,
    userType
  );
  const matches = selectStories(inferred, {
    limit: STORY_EXAMPLE_LIMIT,
    excludeStoryIds: seenStoryIds,
    requiredStoryAttributes,
    requiredNarratorTagKeys,
  });
  return matches.length;
}

export function StoryScreen({
  body,
  onStoryFeedback,
  onGoToPreviousStory,
  storyCardIndex,
  responses,
  userType,
  setupDemographics = {},
  seenStoryIds = [],
}) {
  const inferredDimensions = inferTopDimensions(responses);
  const { requiredNarratorTagKeys, requiredStoryAttributes } = getStoryAttributeFilters(
    responses,
    setupDemographics,
    userType
  );

  const allValues = Object.values(responses).flat();
  const hasNonExclusive = allValues.some(
    (v) => typeof v === "string" && !isExclusiveOption(v)
  );

  const selectedStories = hasNonExclusive
    ? selectStories(inferredDimensions, {
        limit: STORY_EXAMPLE_LIMIT,
        excludeStoryIds: seenStoryIds,
        requiredStoryAttributes,
        requiredNarratorTagKeys,
      })
    : [];

  if (selectedStories.length === 0) {
    // No valid candidates — caller should have skipped this screen
    return null;
  }

  const effectiveLimit = selectedStories.length;

  const availableStories =
    selectedStories.length > 0
      ? selectedStories.map((item, index) => ({
          id: item.id,
          title: "", /*`Story ${index + 1}: ${item.transcriptFile.replace(/_llm\.txt$/i, "")}`,*/
          imageLabel: `Match ${index + 1}`,
          image: item.image,
          thumbnailUrl: item.image || `/thumbnails/${item.id}.jpg`,
          description: item.summary,
          matchDetail: summarizeSelection(item),
          score: item.score,
          confidence: item.confidence,
          contributions: item.contributions,
        }))
      : STORY_CARD_CONTENT.slice(0, STORY_EXAMPLE_LIMIT);

  const usingDynamicSelection = selectedStories.length > 0;
  const safeIndex =
    availableStories.length === 0
      ? 0
      : usingDynamicSelection
        ? 0
        : storyCardIndex % availableStories.length;
  const story = availableStories[safeIndex];

  if (typeof window !== "undefined") {
    const topMatches = selectedStories.map((item) => ({
      id: item.id,
      score: item.score,
      confidence: item.confidence,
      matchedOn: item.matchedOn,
      contributions: item.contributions,
    }));

    console.groupCollapsed("[story-selector] StoryScreen selection");
    console.log("Inferred dimensions", inferredDimensions);
    console.log("Active attribute filters", requiredStoryAttributes);
    console.log("Required narrator tag keys", requiredNarratorTagKeys);
    console.log("Previously seen story IDs", seenStoryIds);
    console.log("Selected stories", topMatches);
    if (story?.id) {
      console.log("Current card", {
        id: story.id,
        index: safeIndex,
        requestedCardNumber: storyCardIndex + 1,
        total: availableStories.length,
        matchDetail: story.matchDetail || "fallback_story",
        score: story.score ?? null,
        confidence: story.confidence ?? null,
      });
    }
    console.groupEnd();
  }

  const dimensionDefinitions = rulesConfig.dimensionDefinitions || {};
  const dimensionLabels = { topic: "Topics", tone: "Tone", narrator: "Narrator" };

  const categoryChips = Object.entries(inferredDimensions)
    .filter(([dim]) => dimensionDefinitions[dim])
    .map(([dim, values]) => ({
      label: dimensionLabels[dim] || dim,
      items: Object.keys(values).map((key) => {
        const def = dimensionDefinitions[dim]?.[key];
        return { key, shortLabel: key.replace(/_/g, " "), definition: def || "" };
      }),
    }));

  return (
    <div className={styles.contentStack}>
      <p className={styles.storyIntro}>{body}</p>
      {/*categoryChips.length > 0 && (
        <div className={styles.inferencePreview}>
          {categoryChips.map(({ label, items }) => (
            <div key={label} className={styles.inferenceRow}>
              <span className={styles.inferenceLabel}>{label}:</span>
              <span className={styles.inferenceChips}>
                {items.map(({ key, shortLabel, definition }) => (
                  <span
                    key={key}
                    className={styles.inferenceChip}
                    title={definition}
                  >
                    {shortLabel}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )*/}
      <div className={styles.storyGrid}>
        <StoryCard
          key={story.id}
          story={{...story, title: `Story ${storyCardIndex + 1}`}}
          titleAction={
            storyCardIndex === 1 || storyCardIndex === 2 ? (
              <button
                type="button"
                className={styles.storyBackLink}
                onClick={onGoToPreviousStory}
              >
                go back to previous story
              </button>
            ) : null
          }
          actions={
            <>
              <p className={styles.storyCount}>
                Example {Math.min(storyCardIndex + 1, effectiveLimit)} of {effectiveLimit}
              </p>
              <p className={styles.storyQuestion}>
                Is this the kind of story you would like?
              </p>
              {/*story.matchDetail ? (
                <p className={styles.storyCount}>{story.matchDetail}</p>
              ) : null*/}
              <button
                type="button"
                className={styles.storyChoiceButton}
                onClick={() => onStoryFeedback(story.id, "Yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={styles.storyChoiceButton}
                onClick={() => onStoryFeedback(story.id, "No")}
              >
                No
              </button>
              <button
                type="button"
                className={styles.storyChoiceButton}
                onClick={() => onStoryFeedback(story.id, "Not sure")}
              >
                Not sure
              </button>
            </>
          }
        />
      </div>
    </div>
  );
}

export function SummaryAgreeScreen({
  screen,
  userType,
  responses,
  updateSelections,
  updateTextResponse,
}) {
  const summary = buildSummary(responses, userType);

  return (
    <div className={styles.contentStack}>
      <h1 className={styles.question}>{screen.question}</h1>
      {screen.subtitle ? <p className={styles.questionSubtitle}>{screen.subtitle}</p> : null}
      <div className={styles.summaryBox}>
        <p className={styles.summaryItem}>{summary.topic}</p>
        <p className={styles.summaryItem}>{summary.purpose}</p>
        <p className={styles.summaryItem}>{summary.narrator}</p>
      </div>
      <div className={styles.optionsGrid}>
        {screen.options.map((option) => {
          const selected = (responses[screen.id] || []).includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
              onClick={() => updateSelections(screen.id, option)}
              aria-pressed={selected}
            >
              <span className={styles.optionIndicator} aria-hidden="true">
                {selected ? <span className={styles.optionTick}>✓</span> : null}
              </span>
              <span className={styles.optionLabel}>{option}</span>
            </button>
          );
        })}
      </div>
      <OptionalTextarea
        screen={screen}
        responses={responses}
        updateTextResponse={updateTextResponse}
      />
    </div>
  );
}

export function SummaryAvoidScreen({
  screen,
  responses,
  updateSelections,
  updateTextResponse,
}) {
  return (
    <div className={styles.contentStack}>
      <h1 className={styles.question}>{screen.question}</h1>
      {screen.subtitle ? <p className={styles.questionSubtitle}>{screen.subtitle}</p> : null}
      <div className={styles.optionsGrid}>
        {screen.options.map((option) => {
          const selected = (responses[screen.id] || []).includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`${styles.optionButton} ${selected ? styles.optionSelected : ""}`}
              onClick={() => updateSelections(screen.id, option)}
              aria-pressed={selected}
            >
              <span className={styles.optionIndicator} aria-hidden="true">
                {selected ? <span className={styles.optionTick}>✓</span> : null}
              </span>
              <span className={styles.optionLabel}>{option}</span>
            </button>
          );
        })}
      </div>
      <OptionalTextarea
        screen={screen}
        responses={responses}
        updateTextResponse={updateTextResponse}
      />
    </div>
  );
}

export function FinalReviewScreen({ responses, userType }) {
  const summary = buildSummary(responses, userType);
  const summaryAvoidOtherKey = getTextareaResponseKey({
    id: "summaryAvoid",
    textarea: { key: "summaryAvoidOther" },
  });
  const deliverySentence = buildDeliverySentence(responses);
  const avoidanceSentence = buildAvoidanceSentence(
    responses.summaryAvoid,
    responses[summaryAvoidOtherKey]
  );

  return (
    <div className={styles.contentStack}>
      <h1 className={styles.question}>Review your preferences</h1>
      <div className={styles.reviewBox}>
        {summary.topic ? <p className={styles.reviewLine}>{summary.topic}</p> : null}
        {summary.purpose ? <p className={styles.reviewLine}>{summary.purpose}</p> : null}
        {summary.narrator ? <p className={styles.reviewLine}>{summary.narrator}</p> : null}
        {deliverySentence ? <p className={styles.reviewLine}>{deliverySentence}</p> : null}
        {avoidanceSentence ? <p className={styles.reviewLine}>{avoidanceSentence}</p> : null}
      </div>
    </div>
  );
}

export function AllDoneScreen({ screen }) {
  return (
    <div className={styles.contentStack}>
      <h1 className={styles.question}>{screen.question}</h1>
      {screen.subtitle ? <p className={styles.questionSubtitle}>{screen.subtitle}</p> : null}
    </div>
  );
}

export function OptionalTextarea({ screen, responses, updateTextResponse }) {
  if (!screen?.textarea) return null;
  const responseKey = getTextareaResponseKey(screen);

  return (
    <textarea
      className={styles.otherTextarea}
      placeholder={screen.textarea.placeholder || ""}
      value={responses[responseKey] || ""}
      onChange={(event) => updateTextResponse(responseKey, event.target.value)}
    />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildSummary(responses, userType) {
  const topicSource = getMeaningfulSelections(
    responses["a-topics"] || responses["b-identity"] || responses["b-places"]
  );
  const purposeSource = getMeaningfulSelections(
    responses["a-purpose"] || responses["b-enjoy"] || responses["b-day"]
  );
  const narratorSource = getMeaningfulSelections(
    responses["a-narrator"] ||
      responses["b-important-people"] ||
      responses["b-carer-role"] ||
      [userType]
  );

  const isApproachAStyle = Boolean(
    responses["a-topics"] || responses["a-purpose"] || responses["a-narrator"]
  );

  return {
    topic: buildTopicSentence(topicSource, isApproachAStyle),
    purpose: buildPurposeSentence(purposeSource),
    narrator: buildNarratorSentence(narratorSource, responses["a-relatable"]),
  };
}

function getMeaningfulSelections(values) {
  if (!values || values.length === 0) return [];
  return values.filter((v) => !isExclusiveOption(v));
}

function buildTopicSentence(values, isApproachAStyle) {
  if (values.length === 0) return "";
  if (isApproachAStyle) {
    const phrases = values.map((v) => `stories about ${normalizeTopicPhrase(v)}`);
    return `You would like to receive ${naturalJoin(phrases)}.`;
  }
  return `Important themes in these stories include ${naturalJoin(values.map(lowercaseFirst))}.`;
}

function buildPurposeSentence(values) {
  if (values.length === 0) return "";
  return `You would like your stories ${naturalJoin(values.map(normalizePurposePhrase))}.`;
}

function buildNarratorSentence(values, relatableResponse) {
  if (values.length === 0) return "";
  const relatable = getMeaningfulSelections(relatableResponse || []);
  if (relatable.includes("No")) {
    return "You do not need these stories to be told by someone who feels similar to you.";
  }
  return `You prefer for your stories to be told by ${naturalJoin(
    values.map(normalizeNarratorPhrase)
  )}.`;
}

export function buildDeliverySentence(responses) {
  const frequency = getMeaningfulSelections(responses.frequency);
  const time = getMeaningfulSelections(responses.time);
  if (frequency.length === 0 && time.length === 0) return "";
  if (frequency.length > 0 && time.length > 0) {
    return `You'd like your stories delivered ${lowercaseFirst(frequency[0])} ${
      lowercaseFirst(time[0]) === "when I ask for one"
        ? "when you ask for one"
        : `in the ${lowercaseFirst(time[0])}`
    }.`;
  }
  if (frequency.length > 0) {
    return `You'd like your stories delivered ${lowercaseFirst(frequency[0])}.`;
  }
  return `You'd like your stories delivered ${
    lowercaseFirst(time[0]) === "when I ask for one"
      ? "when you ask for one"
      : `in the ${lowercaseFirst(time[0])}`
  }.`;
}

export function buildAvoidanceSentence(selectedValues, otherText) {
  const meaningfulSelections = getMeaningfulSelections(selectedValues);
  const trimmedOther = otherText ? otherText.trim() : "";
  if (meaningfulSelections.length === 0 && !trimmedOther) {
    return "There were no stories that you would prefer not to receive.";
  }
  const parts = [];
  if (meaningfulSelections.length > 0) {
    parts.push(naturalJoin(meaningfulSelections.map(normalizeAvoidancePhrase)));
  }
  if (trimmedOther) parts.push(trimmedOther);
  return `You asked us to avoid stories ${
    parts.length === 1 ? `that are ${parts[0]}` : `that are ${parts[0]} and ${parts[1]}`
  }.`;
}

function normalizeTopicPhrase(value) {
  const map = {
    "Being diagnosed with dementia": "being diagnosed with dementia",
    "How people live with dementia": "how people live with dementia",
    "Dementia and working": "dementia and working",
    "Family and relationships": "family and relationships",
    "Hobbies, interests and everyday life": "hobbies, interests and everyday life",
    "Planning for the future": "planning for the future",
    "The challenges of caring for a person with dementia":
      "the challenges of caring for a person with dementia",
    "Perceptions from others and stigma": "other people's perceptions and stigma",
  };
  return map[value] || lowercaseFirst(value);
}

function normalizePurposePhrase(value) {
  const map = {
    "Help me understand dementia": "to help you understand dementia",
    "Give practical advice": "to provide you with practical advice",
    "Show support and reassurance": "to provide support and reassurance",
    "Feel positive or hopeful": "to help you feel positive or hopeful",
    "Help me relax or take my mind off things": "to help you relax or take your mind off things",
    "Talking and socialising with people": "to include talking and socialising with people",
    "Watching TV / films": "to connect with watching TV or films",
    "Listening to stories": "to involve listening to stories",
    "Hobbies (e.g. gardening, crafts)": "to connect with hobbies such as gardening or crafts",
    "Learning new things": "to help you learn new things",
    "At home": "to fit around time at home",
    "With family": "to fit around time with family",
    "Out and about": "to fit around time spent out and about",
    "Quiet time": "to fit around quiet time",
    "Watching / listening to things": "to fit around watching or listening to things",
    "Most days are the same": "to fit around days that are mostly the same",
    "Different every day": "to fit around days that vary from one day to the next",
    "At work": "to fit around being at work",
  };
  return map[value] || `to include ${lowercaseFirst(value)}`;
}

function normalizeNarratorPhrase(value) {
  const map = {
    "Someone my age": "someone your age",
    "Someone a similar age to me": "someone a similar age to you",
    "Someone with a similar background or culture":
      "someone with a similar background or culture to your own",
    "Someone with similar experiences": "someone with similar experiences to your own",
    "Someone different to me": "someone different from you",
    "I don't mind": "any kind of person",
    Family: "stories rooted in family relationships",
    Friends: "stories rooted in friendships",
    Partner: "stories rooted in a partnership",
    "People I spend time with": "stories about the people you spend time with",
    "Community or group": "stories connected to community or group life",
    "I provide daily care": "someone reflecting daily care",
    "I help regularly": "someone reflecting regular support",
    "I support occasionally": "someone reflecting occasional support",
    "I mainly help make decisions": "someone reflecting a decision-making support role",
    "a carer": "someone with similar caring experiences",
    "a person with dementia guided": "someone with experiences similar to your own",
    "a person with dementia unguided": "someone with experiences similar to your own",
  };
  return map[value] || lowercaseFirst(value);
}

function normalizeAvoidancePhrase(value) {
  const map = {
    "Sad or upsetting stories": "sad or upsetting",
    "Stories about the future getting worse": "about the future getting worse",
    "Long or detailed stories": "long or detailed",
    "Lots of reading": "with lots of reading",
    "Stories that don't relate to you": "that don't relate to you",
    None: "none",
    "I don't know / Prefer not to say": "unspecified",
  };
  return map[value] || lowercaseFirst(value);
}

function naturalJoin(values) {
  if (!values || values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function lowercaseFirst(value) {
  if (!value) return "";
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export function inferTopDimensions(responses) {
  const rulesByScreen = rulesConfig.rules || {};
  const totals = {};

  for (const [screenId, value] of Object.entries(responses)) {
    if (!Array.isArray(value)) continue;
    const screenRules = rulesByScreen[screenId];
    if (!screenRules) continue;

    for (const selectedValue of value) {
      const selectionRules = screenRules[selectedValue];
      if (!selectionRules) continue;

      for (const [dimensionName, weightedValues] of Object.entries(selectionRules)) {
        if (!totals[dimensionName]) totals[dimensionName] = {};
        for (const [dimensionValue, weight] of Object.entries(weightedValues)) {
          totals[dimensionName][dimensionValue] =
            (totals[dimensionName][dimensionValue] || 0) + weight;
        }
      }
    }
  }

  const topDimensions = {};
  for (const [dimensionName, weightedValues] of Object.entries(totals)) {
    const sortedEntries = Object.entries(weightedValues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    if (sortedEntries.length > 0) {
      topDimensions[dimensionName] = Object.fromEntries(sortedEntries);
    }
  }
  return topDimensions;
}
