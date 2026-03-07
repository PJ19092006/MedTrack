import type { VaccineResult } from "./eligibility";

export type Reminder = {
  id: string;
  userId: number;
  vaccineName: string;
  type: "dueSoon" | "overdue" | "eligibleNow";
  channel: "inApp" | "email" | "sms";
  title: string;
  body: string;
  createdAt: string; // ISO date
};

export function generateReminders(
  results: VaccineResult[],
  opts: { leadDays: number; channels: Reminder["channel"][]; todayIso: string }
) {
  const reminders: Reminder[] = [];
  for (const r of results) {
    if (r.status === "dueSoon" || r.status === "overdue" || r.status === "eligibleNow") {
      for (const channel of opts.channels) {
        reminders.push({
          id: crypto.randomUUID(),
          userId: r.userId,
          vaccineName: r.vaccineName,
          type: r.status,
          channel,
          title:
            r.status === "overdue" ? `${r.vaccineName} overdue` :
            r.status === "dueSoon" ? `${r.vaccineName} due soon` :
            `${r.vaccineName} available`,
          body: r.reason,
          createdAt: opts.todayIso,
        });
      }
    }
  }
  return reminders;
}