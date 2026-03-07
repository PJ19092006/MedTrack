import { NextResponse } from "next/server";
import { mockVaccineNotifications } from "@/MedTrack/lib/mock/VaccineNotifications";

export async function GET(request: Request) {
  return NextResponse.json(mockVaccineNotifications);
}
