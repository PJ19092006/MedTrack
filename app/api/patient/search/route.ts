import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import users from "@/data/user";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const clinicId = cookieStore.get("clinicId")?.value;

    if (!clinicId) {
      return NextResponse.json(
        { success: false, message: "Clinic not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phin } = body;

    if (!phin) {
      return NextResponse.json(
        { success: false, message: "PHIN is required" },
        { status: 400 }
      );
    }

    const user = users.find((u: any) => u.phin === String(phin).trim());

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const u = user as typeof user & { medicalHistory?: unknown[] };
    return NextResponse.json({
      success: true,
      data: {
        id: String(user.id),
        phin: user.phin,
        name: user.name,
        dob: user.dob,
        conditions: user.conditions || [],
        vaccines: user.vaccines || [],
        medicalHistory: u.medicalHistory || [],
      },
    });
  } catch (error) {
    console.error("Patient search error:", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
