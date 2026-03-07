import mongoose from "mongoose";

const VaccineSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },

    targetGroups: [String],

    schedule: [
      {
        dose: Number,
        recommendedAgeMonths: Number,
      },
    ],

    eligibility: {
      minAgeWeeks: Number,
      maxAgeMonths: Number,
    },

    intervalRules: {
      minDaysBetweenDoses: Number,
    },

    riskRequired: Boolean,
    specialRules: [String],
  },
  { timestamps: true },
);

export default mongoose.models.Vaccine ||
  mongoose.model("Vaccine", VaccineSchema);
