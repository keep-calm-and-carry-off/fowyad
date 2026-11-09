export const CONSENT_STORAGE_KEY = "fowyad-consent";
export const CONSENT_VERSION = "2026-11-07";
export const CONSENT_EVENT = "fowyad:cookie-settings";

export type ConsentChoice = "all" | "necessary";

export type ConsentRecord = {
  choice: ConsentChoice;
  version: string;
  at: string;
};

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.choice !== "all" && parsed.choice !== "necessary") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  const record: ConsentRecord = { choice, version: CONSENT_VERSION, at: new Date().toISOString() };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  return record;
}

/** Аналитику и рекламные скрипты можно подключать только после явного «Принять». */
export function allowsAnalytics() {
  return readConsent()?.choice === "all";
}
