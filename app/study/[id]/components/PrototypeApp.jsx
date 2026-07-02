"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FLOW_ORDERS,
  STORY_CARD_CONTENT,
  STORY_EXAMPLE_LIMIT,
  getFlowScreens,
  isExclusiveOption,
  USER_TYPES
} from "../data/flows";
import useSessionTracker from "../hooks/useSessionTracker";
import { renderScreen, getEffectiveStoryLimit } from "./ScreenRenderer";
import styles from "./PrototypeApp.module.css";

const ETHNIC_BACKGROUND_OPTIONS = [
  "Asian",
  "Black/African/Carribean",
  "Dual/Multiple Ethnic group",
  "Other ethnic group",
  "White"
];

const AGE_OPTIONS = ["Under 40", "40-59", "60-79", "80+"];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const SEXUALITY_OPTIONS = ["Heterosexual", "Gay man", "Bisexual", "Lesbian/gay woman", "Other"];
const REMOTE_USER_TYPE_OPTIONS = [
  {
    label: "I am living with dementia",
    value: "a person with dementia unguided",
  },
  {
    label: "I care for, support, or have supported someone living with dementia",
    value: "a carer",
  },
];

function pickRandomFlowOrderId() {
  const randomIndex = Math.floor(Math.random() * FLOW_ORDERS.length);
  return FLOW_ORDERS[randomIndex]?.id || FLOW_ORDERS[0].id;
}

export default function PrototypeApp({ deploymentMode = "inperson", studyId = "" }) {
  const isInPersonMode = deploymentMode === "inperson";
  const REMOTE_SETUP_STEP_COUNT = 5;
  const tracker = useSessionTracker();
  const [userType, setUserType] = useState(isInPersonMode ? USER_TYPES[0] : "");
  const [flowOrderId, setFlowOrderId] = useState(FLOW_ORDERS[0].id);
  const [activeApproach, setActiveApproach] = useState(null);
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [mode, setMode] = useState("setup");
  const [storyCardIndex, setStoryCardIndex] = useState(0);
  const [seenStoryIds, setSeenStoryIds] = useState([]);
  const [researcherName, setResearcherName] = useState("");
  const [ethnicBackground, setEthnicBackground] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [sexuality, setSexuality] = useState("");
  const [remoteSetupStep, setRemoteSetupStep] = useState(0);

  const flowOrder = FLOW_ORDERS.find((item) => item.id === flowOrderId) || FLOW_ORDERS[0];
  const screens = activeApproach ? getFlowScreens(activeApproach, userType) : [];
  const baseScreen = screens[currentStep] || null;
  const screen = getDisplayScreen(baseScreen, activeApproach, activeFlowIndex, researcherName);
  const isFinalApproach = activeFlowIndex === flowOrder.sequence.length - 1;
  const progressTotal = getProgressTotal(screens, isFinalApproach);
  const progressValue = getProgressValue(currentStep, screens, progressTotal);

  const setupDemographics = {
    researcherName,
    ethnicBackground,
    ageGroup,
    gender,
    sexuality
  };
  const resolvedResearcherName = researcherName.trim() || "A researcher";
  const researchQuestionsHref = studyId
    ? `/study/${studyId}/research-questions?section=pre-task`
    : "/research-questions?section=pre-task";

  // Auto-skip story screens when the candidate pool is empty
  useEffect(() => {
    if (!screen || screen.type !== "stories" || !activeApproach) return;
    const limit = getEffectiveStoryLimit(responses, seenStoryIds, setupDemographics, userType);
    if (limit === 0) {
      console.log("[story-selector] Skipping story screen — no eligible candidates");
      setStoryCardIndex(0);
      if (currentStep >= screens.length - 1 && activeFlowIndex < flowOrder.sequence.length - 1) {
        advanceToNextApproach(flowOrder.sequence[activeFlowIndex + 1], activeFlowIndex + 1);
      } else {
        setCurrentStep((step) => Math.min(step + 1, screens.length - 1));
      }
    }
  }, [screen?.id, activeApproach]);

  // Track screen enters — any screen added to flows.js is automatically covered
  useEffect(() => {
    if (!screen || !activeApproach) return;
    tracker.onScreenEnter(screen.id, null);
  }, [screen?.id, activeApproach]);

  // Track sub-screens (story cards)
  useEffect(() => {
    if (!screen || screen.type !== "stories") return;
    tracker.onScreenEnter(screen.id, `story-${storyCardIndex}`);
  }, [storyCardIndex, screen?.type]);

  // Global mouse-move listener
  useEffect(() => {
    function handleMouseMove(e) {
      tracker.logMouseMove(e.clientX, e.clientY);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isInPersonMode && mode === "setup" && remoteSetupStep >= REMOTE_SETUP_STEP_COUNT) {
      beginStudy();
    }
  }, [isInPersonMode, mode, remoteSetupStep]);

  function beginStudy() {
    const selectedFlowOrderId = isInPersonMode ? flowOrderId : pickRandomFlowOrderId();
    const selectedFlowOrder =
      FLOW_ORDERS.find((item) => item.id === selectedFlowOrderId) || FLOW_ORDERS[0];
    const firstApproach = selectedFlowOrder.sequence[0];

    setFlowOrderId(selectedFlowOrderId);

    try {
      tracker.startSession(selectedFlowOrderId, userType, setupDemographics, deploymentMode);
    } catch (error) {
      console.warn("[tracker] startSession failed", error);
    }
    setMode("flow");
    setActiveFlowIndex(0);
    setActiveApproach(firstApproach);
    setCurrentStep(0);
    setResponses({});
    setStoryCardIndex(0);
    setSeenStoryIds([]);
    setRemoteSetupStep(0);
    try {
      tracker.logEvent("start_study", {
        flowOrderId: selectedFlowOrderId,
        approach: firstApproach,
        deploymentMode,
        demographics: setupDemographics
      });
    } catch (error) {
      console.warn("[tracker] start_study log failed", error);
    }
  }

  function toggleSetupChoice(currentValue, nextValue, setter, key) {
    const resolved = currentValue === nextValue ? "" : nextValue;
    setter(resolved);
    tracker.logClick(`setup_${key}:${resolved || "unknown"}`, { key, value: resolved || null });
  }

  function selectSetupChoice(setter, key, nextValue) {
    setter(nextValue);
    tracker.logClick(`setup_${key}:${nextValue || "unknown"}`, { key, value: nextValue || null });
  }

  function onRemoteStepSelect(setter, key, value) {
    selectSetupChoice(setter, key, value);
    setRemoteSetupStep((current) => Math.min(current + 1, REMOTE_SETUP_STEP_COUNT));
  }

  function beginApproach(approach, flowIndex) {
    setMode("flow");
    setActiveApproach(approach);
    setActiveFlowIndex(flowIndex);
    setCurrentStep(0);
    if (approach !== "S") {
      setResponses({});
    }
    setStoryCardIndex(0);
    tracker.logEvent("start_approach", { approach });
  }

  function advanceToNextApproach(nextApproach, nextFlowIndex) {
    const completedApproach = activeApproach;

    if (completedApproach === "A" || completedApproach === "B") {
      tracker.uploadSessionSnapshot(`approach-${completedApproach.toLowerCase()}`, {
        trigger: "approach_complete",
        screenId: screen?.id,
      });
    }

    // Show interstitial break screen only when moving from index 0 → 1 (task 1 → task 2)
    if (nextFlowIndex === 1) {
      setMode("break");
      return;
    }
    beginApproach(nextApproach, nextFlowIndex);
  }

  function pruneResponsesAfterStep(targetStep) {
    const allowedKeys = new Set();

    for (let index = 0; index <= targetStep; index += 1) {
      const screenAtStep = screens[index];
      if (!screenAtStep) continue;

      allowedKeys.add(screenAtStep.id);

      if (screenAtStep.textarea) {
        allowedKeys.add(screenAtStep.textarea.key || `${screenAtStep.id}Other`);
      }
    }

    setResponses((current) => {
      const next = {};
      for (const [key, value] of Object.entries(current)) {
        if (allowedKeys.has(key)) {
          next[key] = value;
        }
      }
      return next;
    });
  }

  function goBack() {
    if (currentStep === 0) {
      tracker.onScreenLeave();
      tracker.endSession();
      setMode("setup");
      setActiveApproach(null);
      setResponses({});
      setRemoteSetupStep(0);
      tracker.logEvent("return_to_start", { approach: activeApproach });
      return;
    }

    // Skip back over story screens that would be auto-skipped (empty candidate pool)
    let target = currentStep - 1;
    while (target > 0) {
      const candidate = screens[target];
      if (candidate?.type !== "stories") break;
      const limit = getEffectiveStoryLimit(responses, seenStoryIds, setupDemographics, userType);
      if (limit > 0) break;
      target -= 1;
    }

    // Back navigation should reset downstream state so stale answers do not influence scoring.
    pruneResponsesAfterStep(target);
    setSeenStoryIds([]);
    setStoryCardIndex(0);
    setCurrentStep(target);
  }

  function goNext() {
    if (!screen) {
      return;
    }

    if (screen.id === "finalReview") {
      tracker.logEvent("confirm_approach", {
        approach: activeApproach,
        responses
      });

      if (activeFlowIndex < flowOrder.sequence.length - 1) {
        advanceToNextApproach(flowOrder.sequence[activeFlowIndex + 1], activeFlowIndex + 1);
        return;
      }

      setCurrentStep((step) => Math.min(step + 1, screens.length - 1));
      setStoryCardIndex(0);
      return;
    }

    if (screen.id === "allDone") {
      tracker.onScreenLeave();
      tracker.endSession();
      setMode("setup");
      setActiveApproach(null);
      setCurrentStep(0);
      setResponses({});
      setStoryCardIndex(0);
      setSeenStoryIds([]);
      setRemoteSetupStep(0);
      tracker.logEvent("finish_study", { flowOrderId });
      return;
    }

    if (screen.id === "format") {
      tracker.uploadSessionSnapshot("final-selections", {
        trigger: "final_selections_complete",
        screenId: screen.id,
      });
    }

    if (screen.type === "stories") {
      setStoryCardIndex(0);
    }

    if (currentStep >= screens.length - 1 && activeFlowIndex < flowOrder.sequence.length - 1) {
      advanceToNextApproach(flowOrder.sequence[activeFlowIndex + 1], activeFlowIndex + 1);
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, screens.length - 1));
  }

  function updateSelections(screenId, option) {
    const existing = responses[screenId] || [];
    const alreadySelected = existing.includes(option);
    let nextSelection = [];

    if (alreadySelected) {
      nextSelection = existing.filter((item) => item !== option);
    } else if (screen?.selectionMode === "single") {
      nextSelection = [option];
    } else if (isExclusiveOption(option)) {
      nextSelection = [option];
    } else {
      nextSelection = existing.filter((item) => !isExclusiveOption(item));
      if (Array.isArray(screen?.mutex)) {
        for (const group of screen.mutex) {
          if (group.includes(option)) {
            nextSelection = nextSelection.filter((item) => !group.includes(item));
          }
        }
      }
      nextSelection = [...nextSelection, option];
    }

    setResponses((current) => ({
      ...current,
      [screenId]: nextSelection,
    }));

    tracker.logEvent("select_option", {
      approach: activeApproach,
      screenId,
      option,
      selected: !alreadySelected,
      value: nextSelection,
    });
    tracker.setScreenChoice(screenId, nextSelection);

    if (screenId === "summaryAgree") {
      setCurrentStep((step) => Math.min(step + 1, screens.length - 1));
    }
  }

  function onStoryFeedback(storyId, feedback) {
    tracker.logEvent("story_feedback", {
      approach: activeApproach,
      screenId: screen.id,
      storyId,
      feedback
    });
    tracker.logClick(feedback, { storyId });
    tracker.setExampleChoice(storyId, feedback);

    setResponses((current) => ({
      ...current,
      [screen.id]: [...(current[screen.id] || []), feedback]
    }));

    const nextSeenStoryIds = seenStoryIds.includes(storyId)
      ? seenStoryIds
      : [...seenStoryIds, storyId];

    setSeenStoryIds(nextSeenStoryIds);

    const effectiveLimit = getEffectiveStoryLimit(
      responses,
      nextSeenStoryIds,
      setupDemographics,
      userType
    );

    if (storyCardIndex >= effectiveLimit - 1) {
      setStoryCardIndex(0);
      if (currentStep >= screens.length - 1 && activeFlowIndex < flowOrder.sequence.length - 1) {
        advanceToNextApproach(flowOrder.sequence[activeFlowIndex + 1], activeFlowIndex + 1);
      } else {
        setCurrentStep((step) => Math.min(step + 1, screens.length - 1));
      }
      return;
    }

    setStoryCardIndex((current) => current + 1);
  }

  function goToPreviousStory() {
    if (storyCardIndex <= 0) {
      return;
    }

    const previousSeenStoryIds = seenStoryIds.slice(0, -1);
    setSeenStoryIds(previousSeenStoryIds);

    setResponses((current) => {
      const currentStoryResponses = current[screen.id] || [];
      return {
        ...current,
        [screen.id]: currentStoryResponses.slice(0, -1)
      };
    });

    setStoryCardIndex((current) => Math.max(current - 1, 0));
    tracker.logClick("go_back_to_previous_story", {
      approach: activeApproach,
      screenId: screen?.id,
      storyCardIndex
    });
  }

  function onChangeSomething() {
    const summaryIndex = screens.findIndex((item) => item.id === "summaryAgree");
    setCurrentStep(summaryIndex >= 0 ? summaryIndex : 0);
    tracker.logEvent("change_something", { approach: activeApproach });
    tracker.logClick("Change something");
  }

  function updateTextResponse(responseKey, value) {
    setResponses((current) => ({
      ...current,
      [responseKey]: value
    }));

    tracker.logEvent("text_response", {
      approach: activeApproach,
      responseKey,
      value
    });
    tracker.setScreenChoice(responseKey, value);
  }

  if (mode === "break") {
    const nextApproach = flowOrder.sequence[1];
    return (
      <main className={`${styles.shell} ${styles.breakShell}`}>
        <section className={styles.breakCard}>
          <p className={styles.breakMessage}>
            {isInPersonMode
              ? `Thank you, you have finished the first task. Before we continue to the second task, ${resolvedResearcherName} will ask you a few quick questions.`
              : "Thank you, you have finished the first task. Before we continue to the second task, please take a short pause."}
          </p>
          <button
            type="button"
            className={styles.startButton}
            onClick={() => beginApproach(nextApproach, 1)}
          >
            Continue
          </button>
        </section>
      </main>
    );
  }

  if (mode === "setup") {
    if (!isInPersonMode) {
      const remoteSteps = [
        {
          title: "Which of these applies to you?",
          options: REMOTE_USER_TYPE_OPTIONS,
          value: userType,
          key: "user_type",
          setter: setUserType,
        },
        {
          title: "Ethnic background",
          options: ETHNIC_BACKGROUND_OPTIONS.map((option) => ({ label: option, value: option })),
          value: ethnicBackground,
          key: "ethnic_background",
          setter: setEthnicBackground,
        },
        {
          title: "Age",
          options: AGE_OPTIONS.map((option) => ({ label: option, value: option })),
          value: ageGroup,
          key: "age",
          setter: setAgeGroup,
        },
        {
          title: "Gender",
          options: GENDER_OPTIONS.map((option) => ({ label: option, value: option })),
          value: gender,
          key: "gender",
          setter: setGender,
        },
        {
          title: "Sexuality",
          options: SEXUALITY_OPTIONS.map((option) => ({ label: option, value: option })),
          value: sexuality,
          key: "sexuality",
          setter: setSexuality,
        },
      ];

      const currentRemoteStep = remoteSteps[remoteSetupStep] || null;
      const progressLabel = remoteSetupStep < REMOTE_SETUP_STEP_COUNT
        ? `${remoteSetupStep + 1} of ${REMOTE_SETUP_STEP_COUNT}`
        : `${REMOTE_SETUP_STEP_COUNT} of ${REMOTE_SETUP_STEP_COUNT}`;

      return (
        <main className={`${styles.shell} ${styles.setupShell} ${styles.remoteSetupShell}`}>
          <section className={`${styles.setupLayout} ${styles.remoteSetupLayout}`}>
            <div className={styles.remoteSetupCard}>
              <h1 className={`${styles.question} ${styles.setupQuestionLeft}`}>Before we begin</h1>
              <p className={styles.setupHelper}>
                This section is optional, but it helps tailor the study to you and will remain anonymous.
              </p>
              <p className={styles.remoteStepProgress}>Question {progressLabel}</p>

              {currentRemoteStep ? (
                <div className={styles.startGroup}>
                  <h2 className={styles.setupLabel}>{currentRemoteStep.title}</h2>
                  <div className={styles.remoteChoiceColumn}>
                    {currentRemoteStep.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.optionButton} ${styles.remoteOptionButton} ${currentRemoteStep.value === option.value ? styles.optionSelected : ""}`}
                        onClick={() => onRemoteStepSelect(currentRemoteStep.setter, currentRemoteStep.key, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {currentRemoteStep ? (
                <div className={styles.remoteSetupActions}>
                  {remoteSetupStep > 0 ? (
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setRemoteSetupStep((current) => Math.max(current - 1, 0))}
                    >
                      Back
                    </button>
                  ) : <span />}

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setRemoteSetupStep((current) => Math.min(current + 1, REMOTE_SETUP_STEP_COUNT))}
                  >
                    Skip
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className={`${styles.shell} ${styles.setupShell}`}>
        <section className={styles.setupLayout}>
          {isInPersonMode ? (
            <nav aria-label="Research question guides">
              <Link className={styles.questionsLink} href={researchQuestionsHref}>
                Researcher questions
              </Link>
            </nav>
          ) : null}
          <div className={styles.startGroup}>
            <h1 className={`${styles.question} ${!isInPersonMode ? styles.setupQuestionLeft : ""}`}>
              {isInPersonMode ? "Set up the next session (Researcher screen)" : "Before we begin"}
            </h1>
            {!isInPersonMode ? (
              <p className={styles.setupHelper}>
                This section is optional, but it helps tailor the study to you and will remain anonymous.
              </p>
            ) : null}
            {isInPersonMode ? (
              <div className={styles.buttonRow}>
                {FLOW_ORDERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.optionButton} ${flowOrderId === item.id ? styles.optionSelected : ""}`}
                    onClick={() => {
                      setFlowOrderId(item.id);
                      tracker.logClick(`flow_order:${item.id}`, { flowOrderId: item.id });
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.startGroup}>
            {!isInPersonMode ? (
              <h2 className={styles.setupLabel}>Which of these applies to you?</h2>
            ) : null}
            <div className={isInPersonMode ? styles.buttonRow : styles.remoteChoiceColumn}>
              {(isInPersonMode ? USER_TYPES.map((type) => ({ label: type, value: type })) : REMOTE_USER_TYPE_OPTIONS).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.optionButton} ${!isInPersonMode ? styles.remoteOptionButton : ""} ${userType === option.value ? styles.optionSelected : ""}`}
                  onClick={() => {
                    setUserType(option.value);
                    tracker.logClick(`user_type:${option.value}`, { userType: option.value });
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {isInPersonMode ? (
            <div className={styles.startGroup}>
              <label className={styles.startGroup}>
                <h2 className={styles.setupLabel}>Researcher name</h2>
                <input
                  type="text"
                  className={styles.setupInput}
                  value={researcherName}
                  onChange={(event) => setResearcherName(event.target.value)}
                  placeholder="A researcher"
                  autoComplete="off"
                />
              </label>
            </div>
          ) : null}
          <div className={styles.startGroup}>
            {isInPersonMode ? (
              <details className={styles.profileDetails}>
                <summary className={styles.profileSummary}>Participant profile (optional)</summary>
                <div className={styles.profileFields}>
                  <div className={styles.startGroup}>
                    <h2 className={styles.setupLabel}>Ethnic background</h2>
                    <div className={styles.compactGrid}>
                      {ETHNIC_BACKGROUND_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.optionButton} ${ethnicBackground === option ? styles.optionSelected : ""}`}
                          onClick={() => toggleSetupChoice(ethnicBackground, option, setEthnicBackground, "ethnic_background")}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.startGroup}>
                    <h2 className={styles.setupLabel}>Age</h2>
                    <div className={styles.compactGridInline}>
                      {AGE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.optionButton} ${ageGroup === option ? styles.optionSelected : ""}`}
                          onClick={() => toggleSetupChoice(ageGroup, option, setAgeGroup, "age")}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.startGroup}>
                    <h2 className={styles.setupLabel}>Gender</h2>
                    <div className={styles.compactGridInline}>
                      {GENDER_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.optionButton} ${gender === option ? styles.optionSelected : ""}`}
                          onClick={() => toggleSetupChoice(gender, option, setGender, "gender")}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.startGroup}>
                    <h2 className={styles.setupLabel}>Sexuality</h2>
                    <div className={styles.compactGridInline}>
                      {SEXUALITY_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.optionButton} ${sexuality === option ? styles.optionSelected : ""}`}
                          onClick={() => toggleSetupChoice(sexuality, option, setSexuality, "sexuality")}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </details>
            ) : (
              <div className={styles.profileFields}>
                <div className={styles.startGroup}>
                  <h2 className={styles.setupLabel}>Ethnic background</h2>
                  <div className={styles.remoteChoiceColumn}>
                    {ETHNIC_BACKGROUND_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${styles.remoteOptionButton} ${ethnicBackground === option ? styles.optionSelected : ""}`}
                        onClick={() => toggleSetupChoice(ethnicBackground, option, setEthnicBackground, "ethnic_background")}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.startGroup}>
                  <h2 className={styles.setupLabel}>Age</h2>
                  <div className={styles.remoteChoiceColumn}>
                    {AGE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${styles.remoteOptionButton} ${ageGroup === option ? styles.optionSelected : ""}`}
                        onClick={() => toggleSetupChoice(ageGroup, option, setAgeGroup, "age")}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.startGroup}>
                  <h2 className={styles.setupLabel}>Gender</h2>
                  <div className={styles.remoteChoiceColumn}>
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${styles.remoteOptionButton} ${gender === option ? styles.optionSelected : ""}`}
                        onClick={() => toggleSetupChoice(gender, option, setGender, "gender")}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.startGroup}>
                  <h2 className={styles.setupLabel}>Sexuality</h2>
                  <div className={styles.remoteChoiceColumn}>
                    {SEXUALITY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${styles.remoteOptionButton} ${sexuality === option ? styles.optionSelected : ""}`}
                        onClick={() => toggleSetupChoice(sexuality, option, setSexuality, "sexuality")}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.startGroup}>
            <div className={styles.buttonColumn}>
              <button
                type="button"
                className={styles.startButton}
                onClick={beginStudy}
              >
                Start
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <section className={styles.screenCard}>
        {progressValue > 0 && screen?.id !== "allDone" ? (
          <ProgressBar value={progressValue} total={progressTotal} />
        ) : null}
        {renderScreen({
          screen,
          userType,
          responses,
          setupDemographics,
          seenStoryIds,
          updateSelections,
          updateTextResponse,
          onStoryFeedback,
          onGoToPreviousStory: goToPreviousStory,
          storyCardIndex
        })}
        <nav className={styles.navigation}>
          {screen.type !== "info" && (
            <button type="button" className={styles.secondaryButton} onClick={() => { tracker.logClick("Back"); goBack(); }}>
              Back
            </button>
          )}
          {screen.type === "stories" || screen.id === "summaryAgree" ? null : screen.id === "finalReview" ? (
            <div className={styles.finalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={onChangeSomething}
              >
                Change something
              </button>
              <button type="button" className={styles.primaryButton} onClick={() => { tracker.logClick("Confirm"); goNext(); }}>
                Confirm
              </button>
            </div>
          ) : screen.id === "allDone" ? (
            <button type="button" className={styles.primaryButton} onClick={() => { tracker.logClick("Finish"); goNext(); }}>
              Finish
            </button>
          ) : (
            <button type="button" className={styles.primaryButton} onClick={() => { tracker.logClick("Next"); goNext(); }}>
              Next
            </button>
          )}
        </nav>
      </section>
    </main>
  );
}

function ProgressBar({ value, total }) {
  const percent = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className={styles.progressWrap} aria-label={`Progress ${value} of ${total}`}>
      <div className={styles.progressMeta}>
        <span className={styles.progressLabel}>Progress</span>
        <span className={styles.progressValue}>
          {value} of {total}
        </span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function getDisplayScreen(screen, activeApproach, activeFlowIndex, researcherName = "") {
  if (!screen || screen.type !== "info") {
    return screen;
  }

  if (screen.id === "summaryIntro") {
    const resolvedResearcherName = researcherName.trim() || "A researcher";
    return {
      ...screen,
      body: `Thank you, you have finished the second task. ${resolvedResearcherName} will ask you a few more questions and then we will do the final task`
    };
  }

  if (activeFlowIndex === 0 || activeApproach === "S") {
    return screen;
  }

  const transitionBody = activeApproach === "A"
    ? "In this task, we will try a different approach.\nThis time, instead of asking questions about you, we will ask you to choose the kinds of stories you would like to receive."
    : "In this task, we will try a different approach.\nThis time, instead of asking you to choose story types directly, we will ask some questions about you and suggest stories based on your answers.";

  return {
    ...screen,
    body: transitionBody
  };
}

function getProgressStartIndex(screens) {
  // For shared screens, progress begins at summaryAvoid; otherwise from index 1
  const idx = screens.findIndex((s) => s.id === "summaryAvoid");
  return idx >= 0 ? idx : 1;
}

function getProgressTotal(screens, isFinalApproach) {
  const from = getProgressStartIndex(screens);
  return screens.filter((item, index) => index >= from && item.id !== "allDone").length;
}

function getProgressValue(currentStep, screens, progressTotal) {
  const from = getProgressStartIndex(screens);
  return Math.min(Math.max(currentStep - from + 1, 0), progressTotal);
}
