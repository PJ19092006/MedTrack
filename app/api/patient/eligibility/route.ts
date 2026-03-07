import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import users from "@/data/user";

// Import rule logic
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function addDays(baseDate: Date, days: number): Date {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d;
}

function randomFutureDate(): Date {
  const today = new Date();
  const days = Math.floor(Math.random() * 90) + 10;
  return addDays(today, days);
}

function randomPastDate(): Date {
  const today = new Date();
  const days = Math.floor(Math.random() * 365);
  return addDays(today, -days);
}

const colorMap = {
  completed: {
    color: "bg-emerald-500",
    ringColor: "ring-emerald-200",
    dotColor: "#10b981",
  },
  upcoming: {
    color: "bg-amber-500",
    ringColor: "ring-amber-200",
    dotColor: "#f59e0b",
  },
  missed: {
    color: "bg-rose-500",
    ringColor: "ring-rose-200",
    dotColor: "#f43f5e",
  },
};

// Simplified vaccine master data
const vaccinesMaster = [
  {
    code: "Rotavirus",
    name: "Rotavirus",
    schedule: [1, 2, 3],
    intervalRules: { minDaysBetweenDoses: 28 },
  },
  {
    code: "DTaP-IPV-Hib",
    name: "DTaP-IPV-Hib",
    schedule: [1, 2, 3, 4],
    intervalRules: { minDaysBetweenDoses: 28 },
  },
  {
    code: "Tdap",
    name: "Tdap (Booster)",
    schedule: [1],
    intervalRules: { minDaysBetweenDoses: 365 },
  },
  {
    code: "HPV",
    name: "HPV",
    schedule: [1, 2, 3],
    intervalRules: { minDaysBetweenDoses: 180 },
  },
  {
    code: "Pneumococcal",
    name: "Pneumococcal",
    schedule: [1, 2],
    intervalRules: { minDaysBetweenDoses: 365 },
  },
];

interface Vaccine {
  name: string;
  dosesReceived: number;
  lastDoseDate?: Date | string | null;
}

interface PatientData {
  vaccines?: Vaccine[];
  name: string;
  dob: Date | string;
}

function applyEligibilityRules(patient: PatientData): any {
  const today = new Date();
  const timeline = [];
  let idCounter = 1;
  let completedCount = 0;

  for (let master of vaccinesMaster) {
    const patientVac =
      patient.vaccines?.find((v) => v.name === master.code) ||
      patient.vaccines?.find((v) => v.name === master.name);

    const dosesReceived = patientVac?.dosesReceived || 0;
    const lastDoseDate = patientVac?.lastDoseDate
      ? new Date(patientVac.lastDoseDate)
      : null;
    const requiredDoses = master.schedule.length;

    let status: string;
    let finalDate: Date;
    let provider = "—";
    let lot = "—";

    if (dosesReceived >= requiredDoses) {
      status = "completed";
      completedCount++;
      finalDate = lastDoseDate || randomPastDate();
      provider = "Primary Care";
      lot = "LOT" + Math.floor(Math.random() * 9999);
    } else {
      if (lastDoseDate) {
        const minInterval = master.intervalRules?.minDaysBetweenDoses ?? 180;
        const dueDate = addDays(lastDoseDate, minInterval);
        finalDate = dueDate;
        status = dueDate < today ? "missed" : "upcoming";
      } else {
        finalDate = randomFutureDate();
        status = "upcoming";
      }
    }

    const colors = colorMap[status as keyof typeof colorMap];
    timeline.push({
      id: idCounter++,
      name: master.name,
      date: formatDate(finalDate),
      isoDate: finalDate.toISOString().split("T")[0],
      status,
      color: colors.color,
      ringColor: colors.ringColor,
      dotColor: colors.dotColor,
      provider,
      lot,
    });
  }

  timeline.sort(
    (a: any, b: any) =>
      new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime()
  );
  const progress = Math.round((completedCount / vaccinesMaster.length) * 100);

  return {
    timeline,
    progress,
    patientName: patient.name,
    patientDob: patient.dob,
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = users.find(
      (u: any) => String(u.id) === patientId || u.phin === patientId
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const eligibilityData = applyEligibilityRules(user);

    return NextResponse.json({
      success: true,
      data: eligibilityData,
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    return NextResponse.json(
      { success: false, message: "Error retrieving eligibility" },
      { status: 500 }
    );
  }
}
