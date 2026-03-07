"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/MedTrack/components/ui/card";
import { Button } from "@/MedTrack/components/ui/button";
import { Input } from "@/MedTrack/components/ui/input";
import { Label } from "@/MedTrack/components/ui/label";
import { Users, UserPlus, Bell, Trash2 } from "lucide-react";
import gsap from "gsap";

type FamilyMember = {
  id: string;
  name: string;
  healthId: string;
  addedAt: string;
};

export default function FamilyPage() {
  const [healthId, setHealthId] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Sarah (Child)",
      healthId: "105",
      addedAt: "Feb 15, 2026",
    },
    {
      id: "2",
      name: "Tommy (Child)",
      healthId: "106",
      addedAt: "Jan 20, 2026",
    },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll(".member-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: -20, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out",
        },
      );
    }
  }, [members]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = healthId.trim();
    if (!id) {
      setError("Enter your child's Health ID.");
      gsap.to(".error-msg", { opacity: 1, duration: 0.3 });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const hardcodedNames = [
        { name: "Emma (Child)", id: "child1" },
        { name: "Lucas (Child)", id: "child2" },
        { name: "Olivia (Child)", id: "child3" },
      ];
      const nextMember = hardcodedNames[members.length % hardcodedNames.length];
      const name = nextMember.name;

      setMembers((prev) => {
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            name,
            healthId: id,
            addedAt: new Date().toLocaleDateString(),
          },
        ];
      });
      setHealthId("");
    } finally {
      setLoading(false);
    }
  };

  const removeMember = (id: string) => {
    gsap.to(`[data-member-id="${id}"]`, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div ref={cardRef}>
        <Card className="rounded-3xl shadow-sm border-0 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="size-6 text-white" />
              </div>
              Your Family Group
            </CardTitle>
            <p className="text-sm text-gray-600 mt-3">
              Add your children to get them vaccination reminders automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              onSubmit={handleAdd}
              className="flex flex-col sm:flex-row gap-3 p-4 bg-white/50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300"
            >
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="healthId"
                  className="font-semibold text-gray-700"
                >
                  Child's Health ID (PHIN)
                </Label>
                <Input
                  id="healthId"
                  type="text"
                  placeholder="e.g. 105 or 9-digit ID"
                  value={healthId}
                  onChange={(e) => {
                    setHealthId(e.target.value);
                    setError("");
                  }}
                  className="border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <UserPlus className="size-4" />
                  Authenticate
                </Button>
              </div>
            </form>
            {error && (
              <p className="error-msg text-sm text-red-500 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-200/50">
              <Bell className="size-5 text-blue-600 flex-shrink-0" />
              <span>
                Everyone in this group will receive vaccination and appointment
                reminders automatically.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {members.length > 0 && (
        <Card className="rounded-3xl shadow-sm border-0 bg-gradient-to-br from-white to-emerald-50/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {members.length}
              </div>
              In This Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={listRef} className="space-y-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  data-member-id={m.id}
                  className="member-item flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white to-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-500">
                        ID: {m.healthId} • Added {m.addedAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    onClick={() => removeMember(m.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {members.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center hover:border-gray-400 transition-all duration-300">
          <div className="inline-block p-4 bg-gray-200/50 rounded-full mb-4">
            <UserPlus className="size-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">
            No family members added yet. Add your children to get them
            reminders.
          </p>
        </div>
      )}
    </div>
  );
}
