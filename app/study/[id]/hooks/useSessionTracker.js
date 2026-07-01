"use client";

import { useRef, useCallback } from "react";

const STORAGE_KEY = "usability_sessions";
const MOUSE_THROTTLE_MS = 100; // record mouse position at most every 100ms

// ─── localStorage helpers ────────────────────────────────────────────────────

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn("[tracker] localStorage save failed", err);
  }
}

function nextSessionId(sessions) {
  const existing = Object.keys(sessions)
    .map((k) => parseInt(k, 10))
    .filter((n) => !isNaN(n));
  const max = existing.length > 0 ? Math.max(...existing) : 0;
  return String(max + 1).padStart(4, "0");
}

function formatSessionFolderName(isoTime) {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) {
    return "unknown-session-time";
  }

  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${String(date.getFullYear()).slice(-2)}:${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// ─── hook ────────────────────────────────────────────────────────────────────

export default function useSessionTracker() {
  const sessionIdRef = useRef(null);
  const sessionStartTimeRef = useRef(null);
  const currentScreenRef = useRef(null); // { screenId, shownAt }
  const lastMouseRef = useRef(0);
  const uploadChainRef = useRef(Promise.resolve());
  const uploadedMilestonesRef = useRef(new Set());

  // Append an event to the current screen's event list
  const appendEvent = useCallback((event) => {
    const sid = sessionIdRef.current;
    const screenId = currentScreenRef.current?.screenId;
    if (!sid || !screenId) return;

    const sessions = loadSessions();
    const session = sessions[sid];
    if (!session) return;

    const screenEntry = session.screens.find((s) => s.screenId === screenId);
    if (!screenEntry) return;

    screenEntry.events.push({ ...event, t: Date.now() });
    saveSessions(sessions);
  }, []);

  function updateCurrentScreen(mutator) {
    const sid = sessionIdRef.current;
    const screenId = currentScreenRef.current?.screenId;
    if (!sid || !screenId) return;

    const sessions = loadSessions();
    const session = sessions[sid];
    if (!session) return;

    const screenEntry = session.screens.find((s) => s.screenId === screenId);
    if (!screenEntry) return;

    mutator(screenEntry);
    saveSessions(sessions);
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  function startSession(flowOrderId, userType, participantMeta = {}, deploymentMode = "inperson") {
    const sessions = loadSessions();
    const id = nextSessionId(sessions);
    const startTime = new Date().toISOString();

    sessions[id] = {
      sessionId: id,
      startTime,
      sessionFolderName: formatSessionFolderName(startTime),
      approach: flowOrderId, // e.g. "A->B"
      deploymentMode,
      participant: userType,
      participantMeta,
      screens: [],
    };

    saveSessions(sessions);
    sessionIdRef.current = id;
    sessionStartTimeRef.current = startTime;
    currentScreenRef.current = null;
    uploadedMilestonesRef.current = new Set();
    return id;
  }

  function endSession() {
    const sid = sessionIdRef.current;
    if (!sid) return;
    // Close out the last screen if still open
    _leaveCurrentScreen();

    const sessions = loadSessions();
    if (sessions[sid]) {
      sessions[sid].endTime = new Date().toISOString();
      saveSessions(sessions);
    }
    sessionIdRef.current = null;
    sessionStartTimeRef.current = null;
    currentScreenRef.current = null;
  }

  function onScreenEnter(screenId, subScreenId = null) {
    _leaveCurrentScreen();

    const sid = sessionIdRef.current;
    if (!sid) return;

    const effectiveId = subScreenId ? `${screenId}__${subScreenId}` : screenId;
    currentScreenRef.current = { screenId: effectiveId, shownAt: Date.now() };

    const sessions = loadSessions();
    const session = sessions[sid];
    if (!session) return;

    session.screens.push({
      screenId: effectiveId,
      parentScreenId: screenId,
      subScreenId: subScreenId ?? null,
      duration: null,
      events: [],
      choices: {},
    });

    saveSessions(sessions);
  }

  function onScreenLeave() {
    _leaveCurrentScreen();
  }

  function logClick(label, details = {}) {
    appendEvent({ type: "click", label, ...details });
  }

  function logMouseMove(x, y) {
    const now = Date.now();
    if (now - lastMouseRef.current < MOUSE_THROTTLE_MS) return;
    lastMouseRef.current = now;
    appendEvent({ type: "mouse_move", x, y });
  }

  function logEvent(type, details = {}) {
    appendEvent({ type, ...details });
  }

  function setScreenChoice(choiceKey, value) {
    updateCurrentScreen((screenEntry) => {
      screenEntry.choices = {
        ...(screenEntry.choices || {}),
        [choiceKey]: value,
      };
    });
  }

  function setExampleChoice(exampleId, choice) {
    updateCurrentScreen((screenEntry) => {
      screenEntry.choices = {
        ...(screenEntry.choices || {}),
        exampleId,
        choice,
      };
    });
  }

  function uploadSessionSnapshot(milestone, metadata = {}) {
    const sid = sessionIdRef.current;
    if (!sid || !milestone) return Promise.resolve();

    if (uploadedMilestonesRef.current.has(milestone)) {
      return Promise.resolve({ skipped: true });
    }

    const sessions = loadSessions();
    const session = sessions[sid];
    if (!session) return Promise.resolve();

    const startTime = sessionStartTimeRef.current || session.startTime;
    if (!startTime || typeof fetch !== "function") {
      return Promise.resolve();
    }

    const folderName = session.sessionFolderName || formatSessionFolderName(startTime);
    const payload = {
      milestone,
      trigger: metadata.trigger || milestone,
      sessionId: sid,
      startTime,
      folderName,
      screenId: metadata.screenId ?? session.screens?.[session.screens.length - 1]?.screenId ?? null,
      session,
    };

    uploadChainRef.current = uploadChainRef.current
      .catch(() => {})
      .then(() => fetch("/api/session-write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }))
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Session upload failed");
        }

        uploadedMilestonesRef.current.add(milestone);
        return response.json().catch(() => null);
      })
      .catch((error) => {
        console.warn("[tracker] Azure session upload failed", error);
      });

    return uploadChainRef.current;
  }

  // ── Internal ────────────────────────────────────────────────────────────────

  function _leaveCurrentScreen() {
    const sid = sessionIdRef.current;
    const current = currentScreenRef.current;
    if (!sid || !current) return;

    const duration = Date.now() - current.shownAt;
    const sessions = loadSessions();
    const session = sessions[sid];
    if (session) {
      const screenEntry = session.screens.find((s) => s.screenId === current.screenId);
      if (screenEntry) {
        screenEntry.duration = duration;
      }
      saveSessions(sessions);
    }
    currentScreenRef.current = null;
  }

  return {
    startSession,
    endSession,
    onScreenEnter,
    onScreenLeave,
    logClick,
    logMouseMove,
    logEvent,
    setScreenChoice,
    setExampleChoice,
    uploadSessionSnapshot,
  };
}
