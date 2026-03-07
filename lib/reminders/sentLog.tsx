import type { Reminder } from "./generate";

const SENT_KEYS_KEY = "sentReminderKeys";
const SENT_LOG_KEY = "sentReminderLog";


export function makeKey(r: Reminder) {
  // 1 reminder per user/vaccine/type/channel/day
  return `${r.userId}:${r.vaccineName}:${r.type}:${r.channel}:${r.createdAt}`;
}

export function loadSentKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SENT_KEYS_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function saveSentKeys(keys: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SENT_KEYS_KEY, JSON.stringify([...keys]));
}

export function loadSentReminderLog(): Reminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SENT_LOG_KEY);
    const arr: Reminder[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function appendToSentReminderLog(reminders: Reminder[], maxItems = 300) {
  if (typeof window === "undefined") return;
  const existing = loadSentReminderLog();
  const merged = [...reminders, ...existing]; // newest first
  localStorage.setItem(SENT_LOG_KEY, JSON.stringify(merged.slice(0, maxItems)));
}

export function dedupe(reminders: Reminder[], sentKeys: Set<string>) {
  const out: Reminder[] = [];
  const newKeys: string[] = [];
  for (const r of reminders) {
    const key = makeKey(r);
    if (!sentKeys.has(key)) {
      out.push(r);
      newKeys.push(key);
      sentKeys.add(key);
    }
  }
  return { out, newKeys };
}