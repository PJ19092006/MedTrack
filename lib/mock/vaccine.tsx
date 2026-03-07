const data = [
  {
    code: "DTaP_IPV_Hib",
    name: "DTaP-IPV-Hib",
    category: "routine_childhood",
    targetGroups: ["children"],
    schedule: [
      { dose: 1, recommendedAgeMonths: 2 },
      { dose: 2, recommendedAgeMonths: 4 },
      { dose: 3, recommendedAgeMonths: 6 },
    ],
    eligibility: {
      minAgeMonths: 2,
      maxAgeYears: 7,
    },
    intervalRules: {
      minDaysBetweenDoses: 56,
    },
    riskRequired: false,
    specialRules: [],
  },

  {
    code: "ROTAVIRUS",
    name: "Rotavirus",
    category: "routine_childhood",
    targetGroups: ["infants"],
    schedule: [
      { dose: 1, recommendedAgeMonths: 2 },
      { dose: 2, recommendedAgeMonths: 4 },
    ],
    eligibility: {
      minAgeWeeks: 6,
      maxAgeMonths: 8,
    },
    intervalRules: {
      minDaysBetweenDoses: 28,
    },
    riskRequired: false,
    specialRules: ["must_complete_by_8_months"],
  },

  {
    code: "MMR",
    name: "Measles Mumps Rubella",
    category: "routine_childhood",
    targetGroups: ["children", "adults"],
    schedule: [
      { dose: 1, recommendedAgeMonths: 12 },
      { dose: 2, recommendedAgeYears: 4 },
    ],
    eligibility: {
      minAgeMonths: 12,
    },
    intervalRules: {
      minDaysBetweenDoses: 28,
    },
    riskRequired: false,
    specialRules: [],
  },

  {
    code: "VARICELLA",
    name: "Varicella",
    category: "routine_childhood",
    targetGroups: ["children"],
    schedule: [
      { dose: 1, recommendedAgeMonths: 12 },
      { dose: 2, recommendedAgeYears: 4 },
    ],
    eligibility: {
      minAgeMonths: 12,
    },
    intervalRules: {
      minDaysBetweenDoses: 90,
    },
    riskRequired: false,
    specialRules: [],
  },

  {
    code: "HPV",
    name: "Human Papillomavirus",
    category: "school_program",
    targetGroups: ["adolescents"],
    schedule: [
      { dose: 1, recommendedAgeYears: 11 },
      { dose: 2, recommendedAgeYears: 12 },
    ],
    eligibility: {
      minAgeYears: 9,
      maxAgeYears: 26,
    },
    seriesLogic: {
      dosesIfUnder15: 2,
      dosesIf15OrOlder: 3,
    },
    intervalRules: {
      minDaysBetweenDoses: 180,
    },
    riskRequired: false,
    specialRules: ["age_dependent_series"],
  },

  {
    code: "HEP_B",
    name: "Hepatitis B",
    category: "school_program",
    targetGroups: ["children", "adolescents"],
    schedule: [
      { dose: 1, recommendedAgeYears: 11 },
      { dose: 2, recommendedAgeYears: 11.5 },
    ],
    eligibility: {
      minAgeYears: 11,
    },
    intervalRules: {
      minDaysBetweenDoses: 120,
    },
    riskRequired: false,
    specialRules: [],
  },

  {
    code: "MEN_ACYW",
    name: "Meningococcal ACYW",
    category: "school_program",
    targetGroups: ["adolescents"],
    schedule: [{ dose: 1, recommendedAgeYears: 11 }],
    eligibility: {
      minAgeYears: 10,
    },
    intervalRules: {},
    riskRequired: false,
    specialRules: [],
  },

  {
    code: "TDAP",
    name: "Tdap",
    category: "adolescent_adult",
    targetGroups: ["adolescents", "adults", "pregnancy"],
    schedule: [{ dose: 1, recommendedAgeYears: 13 }],
    eligibility: {
      minAgeYears: 13,
    },
    booster: {
      intervalYears: 10,
    },
    pregnancyRule: {
      recommendedWeeksStart: 27,
      recommendedWeeksEnd: 32,
    },
    riskRequired: false,
    specialRules: ["pregnancy_priority", "ten_year_booster"],
  },

  {
    code: "PNEUMOCOCCAL",
    name: "Pneumococcal",
    category: "adult_senior",
    targetGroups: ["seniors", "high_risk"],
    schedule: [{ dose: 1, recommendedAgeYears: 65 }],
    eligibility: {
      minAgeYears: 65,
    },
    riskOverride: [
      "immunocompromised",
      "chronic_kidney_disease",
      "asplenia",
      "HIV",
    ],
    intervalRules: {},
    riskRequired: false,
    specialRules: ["high_risk_priority"],
  },
];

export default data;
