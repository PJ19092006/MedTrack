import users from "../data/user.js";
import vaccinesMaster from "../data/vac.js";

// ===== HELPERS =====

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function addDays(baseDate, days) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d;
}

function randomFutureDate() {
  const today = new Date();
  const days = Math.floor(Math.random() * 90) + 10;
  return addDays(today, days);
}

function randomPastDate() {
  const today = new Date();
  const days = Math.floor(Math.random() * 365);
  return addDays(today, -days);
}

// ===== COLOR MAP =====

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

function rule(patientArray) {
  const patient = patientArray[1]; // change index to test
  const today = new Date();

  const timeline = [];
  let idCounter = 1;
  let completedCount = 0;

  for (let master of vaccinesMaster) {
    const patientVac = patient.vaccines.find((v) => v.name === master.code);

    const dosesReceived = patientVac?.dosesReceived || 0;
    const lastDoseDate = patientVac?.lastDoseDate || null;
    const requiredDoses = master.schedule.length;

    let status;
    let finalDate;
    let provider = "—";
    let lot = "—";

    // ===== COMPLETED =====
    if (dosesReceived >= requiredDoses) {
      status = "completed";
      completedCount++;

      finalDate = lastDoseDate ? new Date(lastDoseDate) : randomPastDate();

      provider = "Primary Care";
      lot = "LOT" + Math.floor(Math.random() * 9999);
    }

    // ===== NOT COMPLETED =====
    else {
      if (lastDoseDate) {
        const minInterval = master.intervalRules?.minDaysBetweenDoses ?? 180;

        const dueDate = addDays(lastDoseDate, minInterval);
        finalDate = dueDate;

        if (dueDate < today) {
          status = "missed";
        } else {
          status = "upcoming";
        }
      } else {
        finalDate = randomFutureDate();
        status = "upcoming";
      }
    }

    const colors = colorMap[status];

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

  timeline.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));

  const progress = (completedCount / vaccinesMaster.length) * 100;

  return {
    timeline,
    progress: Math.round(progress),
  };
}

const output = rule(users);
// console.log(output);
export default output;
