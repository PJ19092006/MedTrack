import catalog from "@/MedTrack/lib/mock/vaccine";

export const ruleByName = new Map(
  catalog.map((v: any) => [v.name.toLowerCase(), v]),
);
