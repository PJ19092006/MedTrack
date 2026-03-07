export type VaccineNotification = {
  id: string
  patientId: string
  type: "eligibility" | "reminder" | "overdue" | "clinic-alert"
  title: string
  message: string
  vaccineName: string
  dueDate?: string
  createdAt: string
  priority: "low" | "medium" | "high"
  read: boolean
}

export const mockVaccineNotifications: VaccineNotification[] = [
  {
    id: "notif-001",
    patientId: "patient-101",
    type: "eligibility",
    title: "You’re eligible for a Flu Shot",
    message:
      "Based on your age and medical history, you are now eligible for the seasonal influenza vaccine.",
    vaccineName: "Influenza",
    createdAt: "2026-02-20T09:30:00Z",
    priority: "medium",
    read: false,
  },
  {
    id: "notif-002",
    patientId: "patient-101",
    type: "reminder",
    title: "COVID-19 Booster Reminder",
    message:
      "Your COVID-19 booster is due in 7 days. Book your appointment to stay protected.",
    vaccineName: "COVID-19 Booster",
    dueDate: "2026-02-27",
    createdAt: "2026-02-20T08:10:00Z",
    priority: "high",
    read: false,
  },
  {
    id: "notif-003",
    patientId: "patient-102",
    type: "overdue",
    title: "HPV Vaccine Overdue",
    message:
      "Our records show your HPV vaccination schedule is overdue. Please contact your clinic.",
    vaccineName: "HPV",
    dueDate: "2026-02-10",
    createdAt: "2026-02-19T14:00:00Z",
    priority: "high",
    read: false,
  },
  {
    id: "notif-004",
    patientId: "patient-103",
    type: "clinic-alert",
    title: "Clinic Follow-Up Needed",
    message:
      "Patient is immunocompromised and requires manual review for Pneumococcal vaccination.",
    vaccineName: "Pneumococcal",
    createdAt: "2026-02-18T17:20:00Z",
    priority: "medium",
    read: true,
  },
]