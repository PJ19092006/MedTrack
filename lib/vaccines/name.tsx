export function normalizeVaccineName(name: string) {
  return name.trim().toLowerCase();
}

const ALIASES: Record<string, string> = {
  hpv: "Human Papillomavirus",
};

export function toCatalogName(name: string) {
  const key = normalizeVaccineName(name);
  return ALIASES[key] ?? name;
}