import catalog from "@/MedTrack/lib/mock/vaccine"; // your vaccine.tsx data array
import {
  parseDob,
  yearsBetween,
  addDays,
  addYears,
  iso,
} from "@/MedTrack/lib/date";
import { findUserHistoryForRule } from "@/MedTrack/lib/vaccines/history";

type User = {
  id: number;
  name: string;
  dob: string;
  pregnant?: boolean;
  gestationWeeks?: number;
  immunocompromised?: boolean;
  conditions?: string[];
  vaccines: {
    name: string;
    dosesReceived: number;
    lastDoseDate: string | null;
  }[];
  phone?: string;
  email?: string;
};

export type VaccineStatus =
  | "completed"
  | "dueSoon"
  | "overdue"
  | "eligibleNow"
  | "notEligible";

export type VaccineResult = {
  userId: number;
  vaccineName: string;
  status: VaccineStatus;
  dueDate: string | null;
  reason: string;
};

export function evaluateUserVaccinesFromCatalog(
  user: User,
  today = new Date(),
): VaccineResult[] {
  const dob = parseDob(user.dob);
  const ageYears = yearsBetween(dob, today);

  return catalog.map((rule: any) => {
    // merge in user history (or default to "no history")
    const hist = findUserHistoryForRule(user.vaccines ?? [], rule.name);
    const v = {
      name: rule.name, // important: use catalog name as the canonical output name
      dosesReceived: hist?.dosesReceived ?? 0,
      lastDoseDate: hist?.lastDoseDate ?? null,
    };

    // --- eligibility checks (same as your current code) ---
    const minAgeYears = rule.eligibility?.minAgeYears;
    const maxAgeYears = rule.eligibility?.maxAgeYears;

    if (typeof minAgeYears === "number" && ageYears < minAgeYears) {
      return {
        userId: user.id,
        vaccineName: v.name,
        status: "notEligible",
        dueDate: null,
        reason: `Under minimum age (${minAgeYears}).`,
      };
    }
    if (typeof maxAgeYears === "number" && ageYears > maxAgeYears) {
      return {
        userId: user.id,
        vaccineName: v.name,
        status: "notEligible",
        dueDate: null,
        reason: `Above maximum age (${maxAgeYears}).`,
      };
    }

    // Pneumococcal: allow if 65+ OR high-risk override list
    if (rule.code === "PNEUMOCOCCAL") {
      const isHighRisk =
        !!user.immunocompromised ||
        (user.conditions ?? []).some((c) =>
          (rule.riskOverride ?? []).includes(c),
        );

      if (ageYears < 65 && !isHighRisk) {
        return {
          userId: user.id,
          vaccineName: v.name,
          status: "notEligible",
          dueDate: null,
          reason: "Not 65+ and no high-risk override.",
        };
      }
    }

    // --- Compute due date ---
    let due: Date | null = null;

    // Tdap booster + pregnancy priority window
    if (rule.code === "TDAP" && v.lastDoseDate) {
      due = addYears(
        new Date(v.lastDoseDate + "T00:00:00"),
        rule.booster?.intervalYears ?? 10,
      );

      const w = user.gestationWeeks;
      if (user.pregnant && typeof w === "number") {
        const start = rule.pregnancyRule?.recommendedWeeksStart ?? 27;
        const end = rule.pregnancyRule?.recommendedWeeksEnd ?? 32;
        if (w >= start && w <= end) {
          return {
            userId: user.id,
            vaccineName: v.name,
            status: "eligibleNow",
            dueDate: iso(today),
            reason: `Pregnancy window (${start}-${end} weeks).`,
          };
        }
      }
    }

    // Schedule-based: next dose due by recommended age (relative to DOB)
    if (!due && Array.isArray(rule.schedule)) {
      const nextDoseNumber = (v.dosesReceived ?? 0) + 1;
      const nextDose = rule.schedule.find(
        (s: any) => s.dose === nextDoseNumber,
      );

      if (!nextDose) {
        return {
          userId: user.id,
          vaccineName: v.name,
          status: "completed",
          dueDate: null,
          reason: "Series complete.",
        };
      }

      due = new Date(dob);
      if (typeof nextDose.recommendedAgeMonths === "number") {
        due.setMonth(due.getMonth() + nextDose.recommendedAgeMonths);
      } else if (typeof nextDose.recommendedAgeYears === "number") {
        due.setFullYear(
          due.getFullYear() + Math.floor(nextDose.recommendedAgeYears),
        );
        const frac = nextDose.recommendedAgeYears % 1;
        if (frac === 0.5) due.setMonth(due.getMonth() + 6);
      }

      if (v.lastDoseDate && rule.intervalRules?.minDaysBetweenDoses) {
        const minNext = addDays(
          new Date(v.lastDoseDate + "T00:00:00"),
          rule.intervalRules.minDaysBetweenDoses,
        );
        if (minNext > due) due = minNext;
      }
    }

    if (!due) {
      return {
        userId: user.id,
        vaccineName: v.name,
        status: "notEligible",
        dueDate: null,
        reason: "No due date logic matched.",
      };
    }

    // --- Convert due date to status ---
    const dueIso = iso(due);
    const todayIso = iso(today);
    const ms =
      new Date(dueIso + "T00:00:00").getTime() -
      new Date(todayIso + "T00:00:00").getTime();
    const daysUntil = Math.round(ms / (1000 * 60 * 60 * 24));

    if (daysUntil < 0)
      return {
        userId: user.id,
        vaccineName: v.name,
        status: "overdue",
        dueDate: dueIso,
        reason: `Overdue since ${dueIso}.`,
      };
    if (daysUntil <= 30)
      return {
        userId: user.id,
        vaccineName: v.name,
        status: "dueSoon",
        dueDate: dueIso,
        reason: `Due on ${dueIso} (≤30 days).`,
      };

    return {
      userId: user.id,
      vaccineName: v.name,
      status: "completed",
      dueDate: dueIso,
      reason: `Not due soon (due ${dueIso}).`,
    };
  });
}
