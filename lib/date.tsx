
export function parseDob(dob: string): Date {
  // supports "YYYYMMDD" or "YYYY-MM-DD"
  if (/^\d{8}$/.test(dob)) {
    const y = Number(dob.slice(0, 4));
    const m = Number(dob.slice(4, 6)) - 1;
    const d = Number(dob.slice(6, 8));
    return new Date(y, m, d);
  }
  return new Date(dob + "T00:00:00");
}

export function yearsBetween(dob: Date, today = new Date()) {
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}