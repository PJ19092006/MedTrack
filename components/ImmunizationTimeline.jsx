"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarDays,
  Syringe,
  Building2,
  Hash,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
} from "lucide-react";

export default function ImmunizationTimeline({
  timeline: initialTimeline,
  progress,
  patientName,
}) {
  const [selected, setSelected] = useState(null);
  const [dialogVaccine, setDialogVaccine] = useState(null);

  // Use provided timeline or empty array
  const timeline = initialTimeline || [];
  const sorted = [...timeline].sort(
    (a, b) => new Date(a.isoDate) - new Date(b.isoDate),
  );

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="w-full shadow-sm border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="pt-6 px-8 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Syringe className="w-4 h-4 text-slate-400" />
                Immunization Timeline
              </CardTitle>
              {patientName && (
                <p className="text-sm text-muted-foreground mt-1">
                  {patientName}
                </p>
              )}
            </div>
            {progress !== undefined && (
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800">
                  {progress}%
                </div>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="px-8 pb-6 pt-4">
          {/* Legend */}
          <div className="flex gap-6 mb-8">
            <Legend color="bg-emerald-500" label="Completed" />
            <Legend color="bg-amber-500" label="Upcoming" />
            <Legend color="bg-rose-500" label="Missed" />
          </div>

          {/* Scroll container */}
          <div
            className="overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent",
            }}
          >
            <div
              className="relative"
              style={{ minWidth: "900px", paddingBottom: "8px" }}
            >
              {/* Timeline line */}
              <div
                className="absolute left-0 right-0 bg-slate-200"
                style={{ top: "56px", height: "2px", zIndex: 0 }}
              />

              <div
                className="relative flex justify-between items-start w-full"
                style={{ zIndex: 1 }}
              >
                {sorted.map((vaccine) => (
                  <Tooltip key={vaccine.id}>
                    <TooltipTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelected(vaccine.id);
                          setDialogVaccine(vaccine);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelected(vaccine.id);
                            setDialogVaccine(vaccine);
                          }
                        }}
                        className="flex flex-col items-center cursor-pointer group outline-none rounded-xl px-2 py-1 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-300"
                        style={{ width: "112px" }}
                      >
                        {/* Date */}
                        <div
                          className="flex items-center justify-center"
                          style={{ height: "40px" }}
                        >
                          <span
                            className={`text-[10px] font-medium text-center leading-tight
                              ${
                                vaccine.status === "completed"
                                  ? "text-slate-500"
                                  : vaccine.status === "missed"
                                    ? "text-rose-400"
                                    : "text-amber-400"
                              }
                            `}
                          >
                            {vaccine.date}
                          </span>
                        </div>

                        {/* Dot */}
                        <div
                          className="flex items-center justify-center"
                          style={{ height: "32px" }}
                        >
                          <div
                            className={`rounded-full border-[3px] border-white shadow-md transition-transform duration-150 group-hover:scale-125
                              ${selected === vaccine.id ? "scale-125" : ""}
                              ${vaccine.color}
                            `}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </div>

                        {/* Name + badge */}
                        <div className="mt-3 flex flex-col items-center gap-1">
                          <span
                            className={`text-xs font-semibold text-center leading-tight
                              ${
                                vaccine.status === "completed"
                                  ? "text-slate-800"
                                  : vaccine.status === "missed"
                                    ? "text-rose-600"
                                    : "text-amber-600"
                              }
                            `}
                          >
                            {vaccine.name}
                          </span>

                          {vaccine.status === "completed" ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] rounded-full px-2 py-0 hover:bg-emerald-50">
                              Done
                            </Badge>
                          ) : vaccine.status === "missed" ? (
                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] rounded-full px-2 py-0 hover:bg-rose-50">
                              Missed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] rounded-full px-2 py-0 hover:bg-amber-50">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent className="bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl">
                      <div className="font-semibold mb-1">{vaccine.name}</div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <CalendarDays className="w-3 h-3" />
                        {vaccine.date}
                      </div>
                      {vaccine.provider && vaccine.provider !== "—" && (
                        <div className="text-slate-400 text-[10px] mt-1">
                          {vaccine.provider} · Lot: {vaccine.lot}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccine Detail Dialog */}
      <Dialog
        open={!!dialogVaccine}
        onOpenChange={(open) => {
          if (!open) {
            setDialogVaccine(null);
            setSelected(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          {dialogVaccine && (
            <>
              {/* Coloured top strip based on status */}
              <div
                className={`h-2 w-full
                  ${
                    dialogVaccine.status === "completed"
                      ? "bg-emerald-500"
                      : dialogVaccine.status === "missed"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                  }
                `}
              />

              <div className="px-6 pt-5 pb-6">
                <DialogHeader className="mb-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <DialogTitle className="text-lg font-bold text-slate-800 leading-tight">
                        {dialogVaccine.name}
                      </DialogTitle>
                      <div className="mt-1.5">
                        {dialogVaccine.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : dialogVaccine.status === "missed" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Missed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Details grid */}
                <div className="flex flex-col gap-3">
                  <DetailRow
                    icon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                    label="Scheduled Date"
                    value={dialogVaccine.date}
                  />

                  {dialogVaccine.provider && dialogVaccine.provider !== "—" && (
                    <DetailRow
                      icon={<Building2 className="w-4 h-4 text-slate-400" />}
                      label="Provider"
                      value={dialogVaccine.provider}
                    />
                  )}

                  {dialogVaccine.lot && dialogVaccine.lot !== "—" && (
                    <DetailRow
                      icon={<Hash className="w-4 h-4 text-slate-400" />}
                      label="Lot Number"
                      value={dialogVaccine.lot}
                    />
                  )}
                </div>

                {/* Schedule button — only for upcoming or missed */}
                {dialogVaccine.status !== "completed" && (
                  <div className="mt-6">
                    <div
                      role="button"
                      tabIndex={0}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 outline-none
                        focus-visible:ring-2 focus-visible:ring-offset-2
                        ${
                          dialogVaccine.status === "missed"
                            ? "bg-rose-500 hover:bg-rose-600 text-white focus-visible:ring-rose-400"
                            : "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400"
                        }
                      `}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          // hook up your scheduling logic here
                        }
                      }}
                    >
                      <CalendarClock className="w-4 h-4" />
                      {dialogVaccine.status === "missed"
                        ? "Reschedule Appointment"
                        : "Schedule Appointment"}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm font-medium text-slate-700">{value}</span>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2 text-xs text-slate-600">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
