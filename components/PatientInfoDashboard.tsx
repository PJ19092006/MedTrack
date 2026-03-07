"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PatientHistory, {
  getStubHistory,
} from "@/MedTrack/components/PatientHistory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/MedTrack/components/ui/card";
import { Badge } from "@/MedTrack/components/ui/badge";
import { Button } from "@/MedTrack/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/MedTrack/components/ui/dialog";
import { Plus } from "lucide-react";

type Vaccine = {
  name: string;
  dosesReceived: number;
  lastDoseDate: string | Date | null;
};

type MedicalHistoryRecord = {
  _id?: string;
  date: string | Date;
  type: "DIAGNOSIS" | "PRESCRIPTION";
  title: string;
  details: string;
  notes?: string;
};

type RecordType = "DIAGNOSIS" | "PRESCRIPTION";

type HistoryRecord = {
  id: string;
  date: string;
  type: RecordType;
  title: string;
  details: string;
  notes?: string;
};

type Patient = {
  id: string;
  name: string;
  dob: string | Date;
  phin?: string;
  conditions?: string[];
  vaccines: Vaccine[];
  medicalHistory?: MedicalHistoryRecord[];
};

function calculateAge(dob?: string) {
  if (!dob) return "—";

  let birthDate: Date;

  if (/^\d{4}-\d{2}-\d{2}/.test(dob)) {
    birthDate = new Date(dob);
  } else if (/^\d{8}$/.test(dob)) {
    const year = Number(dob.substring(0, 4));
    const month = Number(dob.substring(4, 6)) - 1;
    const day = Number(dob.substring(6, 8));
    birthDate = new Date(year, month, day);
  } else {
    birthDate = new Date(dob);
  }

  if (isNaN(birthDate.getTime())) return "—";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function formatDOB(dob?: string | Date) {
  if (!dob) return "Not available";

  let birthDate: Date;

  if (dob instanceof Date) {
    birthDate = dob;
  } else if (/^\d{4}-\d{2}-\d{2}/.test(dob)) {
    birthDate = new Date(dob);
  } else if (/^\d{8}$/.test(dob)) {
    const year = Number(dob.substring(0, 4));
    const month = Number(dob.substring(4, 6)) - 1;
    const day = Number(dob.substring(6, 8));
    birthDate = new Date(year, month, day);
  } else {
    birthDate = new Date(dob);
  }

  if (isNaN(birthDate.getTime())) return "Not available";

  return birthDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PatientInfoDashboard({
  patient,
}: {
  patient: Patient;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoryRecord[]>([]);

  // Convert database medical history to display format
  const convertToHistoryRecord = (
    record: MedicalHistoryRecord,
  ): HistoryRecord => {
    const date =
      record.date instanceof Date
        ? record.date.toISOString().split("T")[0]
        : String(record.date).split("T")[0];
    return {
      id: record._id || crypto.randomUUID(),
      date,
      type: record.type,
      title: record.title,
      details: record.details,
      notes: record.notes,
    };
  };

  const databaseHistory = (patient.medicalHistory || []).map(
    convertToHistoryRecord,
  );
  const stubHistory = getStubHistory(String(patient.id));
  const combinedHistory = [...stubHistory, ...localHistory, ...databaseHistory];

  const age = calculateAge(
    patient.dob instanceof Date
      ? patient.dob.toISOString().split("T")[0]
      : patient.dob,
  );

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    if (open && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.25 },
      );
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const newRecord: HistoryRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      type: form.get("type") as RecordType,
      title: form.get("title") as string,
      details: form.get("details") as string,
      notes: form.get("notes") as string,
    };

    setLocalHistory((prev) => [newRecord, ...prev]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* ================= PATIENT OVERVIEW ================= */}
      <Card className="rounded-2xl shadow-md border bg-white relative">
        <CardHeader className="flex flex-row justify-between items-start">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {patient.name}
          </CardTitle>

          {/* ➕ ADD RECORD BUTTON */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <DialogContent ref={modalRef} className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  >
                    <option value="DIAGNOSIS">Diagnosis</option>
                    <option value="PRESCRIPTION">Prescription</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    name="title"
                    required
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Details</label>
                  <textarea
                    name="details"
                    required
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    name="notes"
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Save Record
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-lg font-medium">{age} years</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="text-lg font-medium">{formatDOB(patient.dob)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Chronic Conditions
              </p>
              {patient.conditions?.length ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.conditions.map((c, i) => (
                    <Badge key={i} variant="destructive">
                      {c}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge variant="secondary">None</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= VACCINATION RECORD ================= */}
      <Card className="rounded-2xl shadow-sm border bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Vaccination Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 pr-4">Vaccine</th>
                  <th className="text-left py-2 pr-4">Doses</th>
                  <th className="text-left py-2">Last Dose</th>
                </tr>
              </thead>
              <tbody>
                {patient?.vaccines?.length ? (
                  patient.vaccines.map((vac, index) => {
                    let lastDoseFormatted = "—";
                    if (vac.lastDoseDate) {
                      const date =
                        vac.lastDoseDate instanceof Date
                          ? vac.lastDoseDate
                          : new Date(vac.lastDoseDate);
                      if (!isNaN(date.getTime())) {
                        lastDoseFormatted = date.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                      }
                    }
                    return (
                      <tr key={index} className="border-b hover:bg-muted/40">
                        <td className="py-3 pr-4 font-medium">{vac.name}</td>
                        <td className="py-3 pr-4">{vac.dosesReceived}</td>
                        <td className="py-3">{lastDoseFormatted}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-muted-foreground">
                      No vaccination records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ================= ORIGINAL HISTORY ================= */}
      <PatientHistory
        patientID={String(patient.id)}
        history={combinedHistory}
      />
    </div>
  );
}
