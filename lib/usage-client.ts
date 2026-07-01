import { EVENT_TYPES, getScreenIdFromPath } from './usage-taxonomy';

export interface UsageEventPayload {
  eventType: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
}

const SESSION_KEY = 'lend_usage_session_id';

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function startUsageSession(): string {
  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, sessionId);

  void logUsageEvent({
    eventType: EVENT_TYPES.SESSION_START,
    sessionId,
    pagePath: window.location.pathname,
    metadata: {
      screenId: getScreenIdFromPath(window.location.pathname),
      trigger: 'start_setup',
    },
  });

  return sessionId;
}

export async function endUsageSession(reason: string): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) return;

  await logUsageEvent({
    eventType: EVENT_TYPES.SESSION_END,
    sessionId,
    pagePath: window.location.pathname,
    metadata: {
      screenId: getScreenIdFromPath(window.location.pathname),
      reason,
    },
  });

  localStorage.removeItem(SESSION_KEY);
}

export async function logUsageEvent(payload: UsageEventPayload): Promise<void> {
  if (typeof window === 'undefined') return;

  const sessionId = payload.sessionId ?? getSessionId();

  const body = {
    ...payload,
    pagePath: payload.pagePath ?? window.location.pathname,
    sessionId: sessionId ?? undefined,
  };

  try {
    await fetch('/api/usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Intentionally ignore logging failures so UI flow is never blocked.
  }
}

export async function logSessionEvent(
  payload: Omit<UsageEventPayload, 'sessionId'>,
): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) return;

  await logUsageEvent({
    ...payload,
    sessionId,
  });
}