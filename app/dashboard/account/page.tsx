"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuthenticatedUser } from "@/MedTrack/hooks/useAuthenticatedUser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/MedTrack/components/ui/card";
import { Badge } from "@/MedTrack/components/ui/badge";
import { User, Calendar, ShieldCheck, Syringe, Loader2 } from "lucide-react";

type Vaccine = {
  name: string;
  dosesReceived: number;
  lastDoseDate?: string | Date | null;
};

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
    month: "long",
    year: "numeric",
  });
}

function calculateAge(dob?: string | Date) {
  if (!dob) return "—";

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

  if (isNaN(birthDate.getTime())) return "—";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function ProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useAuthenticatedUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || isLoading || !mounted) return;

    const elements = containerRef.current.querySelectorAll(".animate-item");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      },
    );
  }, [isLoading, mounted]);

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Please log in to view your account</p>
      </div>
    );
  }

  const age = calculateAge(user.dob);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-8 p-6 max-w-5xl mx-auto"
    >
      {/* ================= Profile Overview ================= */}
      <Card className="rounded-2xl shadow-md border bg-white hover:shadow-lg transition">
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="text-blue-500" />
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {user.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar size={16} />
              Date of Birth
            </p>
            <p className="text-lg font-medium">{formatDOB(user.dob)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="text-lg font-medium">{age} years</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={16} />
              Chronic Conditions
            </p>

            {user.conditions && user.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {user.conditions.map((condition: string, index: number) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="rounded-full"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <Badge variant="secondary" className="mt-1">
                None
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================= Vaccine Summary ================= */}
      <Card className="animate-item rounded-2xl shadow-sm border bg-white hover:shadow-md transition">
        <CardHeader className="flex flex-row items-center gap-3">
          <Syringe className="text-emerald-500" />
          <CardTitle className="text-xl font-semibold">
            Vaccination Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {user.vaccines && user.vaccines.length > 0 ? (
              user.vaccines.map((vac: Vaccine, index: number) => {
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
                  <div
                    key={index}
                    className="p-4 border rounded-xl hover:bg-muted/50 transition group"
                  >
                    <p className="font-medium text-base group-hover:text-blue-600 transition">
                      {vac.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Doses Taken: {vac.dosesReceived}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last Dose: {lastDoseFormatted}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">
                No vaccination records available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
