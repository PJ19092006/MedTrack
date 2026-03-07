import { profile } from "@/components/PatientProfile";
import MedicalHistoryTimeline from "@/MedTrack/components/Medhistory";

export default function Page() {
  return <MedicalHistoryTimeline patientID={profile.id} />;
}
