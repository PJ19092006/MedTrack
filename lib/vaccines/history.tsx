
import { normalizeVaccineName, toCatalogName } from "./name";

type VaccineHistoryItem = { name: string; dosesReceived: number; lastDoseDate: string | null };

export function findUserHistoryForRule(
  userVaccines: VaccineHistoryItem[],
  ruleName: string
): VaccineHistoryItem | null {
  const ruleKey = normalizeVaccineName(ruleName);

  for (const uv of userVaccines) {
    const uvCatalogName = toCatalogName(uv.name);
    if (normalizeVaccineName(uvCatalogName) === ruleKey) return uv;
  }
  return null;
}