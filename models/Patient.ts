import mongoose from "mongoose";

const VaccineSchema = new mongoose.Schema({
  name: String,
  dosesReceived: Number,
  lastDoseDate: Date,
});

const HistorySchema = new mongoose.Schema({
  date: Date,
  type: {
    type: String,
    enum: ["DIAGNOSIS", "PRESCRIPTION"],
  },
  title: String,
  details: String,
  notes: String,
});

const PatientSchema = new mongoose.Schema(
  {
    // 🔐 AUTH
    phin: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 👤 PROFILE
    name: String,
    dob: Date,
    conditions: [String],

    // 🏥 MEDICAL
    vaccines: [VaccineSchema],
    medicalHistory: [HistorySchema],
  },
  { timestamps: true },
);

export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);
