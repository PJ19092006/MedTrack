"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Phone, Mail } from "lucide-react";

export const profile = {
  name: "Sarah Jenkins",
  id: "#839201",
  avatar: "https://i.pravatar.cc/150?img=47",
  demographics: {
    gender: "Female",
    age: 28,
    dob: "Oct 14, 1996",
  },
  riskFactors: [
    { label: "Pregnancy (Trimester 2)", variant: "pregnancy" },
    { label: "Asthma", variant: "default" },
  ],
  contact: {
    phone: "(555) 123-4567",
    email: "sarah.j@example.com",
  },
  lastVisit: "Feb 3, 2025",
};

export default function PatientProfile() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-[300px] rounded-2xl border border-slate-200 shadow-sm bg-white">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between pt-5 pb-0 px-5">
          <CardTitle className="text-sm font-semibold text-slate-800">
            Profile
          </CardTitle>
          <div
            role="button"
            tabIndex={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors duration-150 outline-none
              focus-visible:ring-2 focus-visible:ring-slate-300
              ${hovered ? "bg-slate-100" : ""}
            `}
            aria-label="Edit profile"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-6 pt-4 flex flex-col gap-5">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-100 shadow-sm">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">{profile.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">ID: {profile.id}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Demographics */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              Demographics
            </p>
            <p className="text-sm font-medium text-slate-700">
              {profile.demographics.gender}, {profile.demographics.age} Years
              Old
            </p>
            <p className="text-xs text-slate-500">
              DOB: {profile.demographics.dob}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Risk Factors */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              Risk Factors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.riskFactors.map((factor) => (
                <span
                  key={factor.label}
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border
                    ${
                      factor.variant === "pregnancy"
                        ? "bg-red-50 text-red-500 border-red-100"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }
                  `}
                >
                  {factor.label}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              Contact
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {profile.contact.phone}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {profile.contact.email}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Last Visit */}
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              Last Visit
            </p>
            <p className="text-sm font-medium text-slate-700">
              {profile.lastVisit}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
