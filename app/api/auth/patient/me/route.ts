import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import users from "@/data/user";

function toPatientResponse(user: Record<string, unknown>) {
  return {
    _id: String(user.id),
    phin: user.phin,
    name: user.name,
    dob: user.dob,
    conditions: user.conditions || [],
    vaccines: user.vaccines || [],
    medicalHistory: (user.medicalHistory as unknown[] | undefined) || [],
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = users.find(
      (u: any) => String(u.id) === patientId || u.phin === patientId
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: toPatientResponse(user) });
  } catch (error) {
    console.error("GET /me error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    // No DB: accept update and return the merged data (not persisted)
    const user = users.find(
      (u: any) => String(u.id) === patientId || u.phin === patientId
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const userWithHistory = user as typeof user & {
      medicalHistory?: unknown[];
    };
    const merged = {
      ...user,
      name: body.name ?? user.name,
      dob: body.dob ?? user.dob,
      conditions: body.conditions ?? user.conditions,
      vaccines: body.vaccines ?? user.vaccines,
      medicalHistory:
        body.medicalHistory ?? userWithHistory.medicalHistory ?? [],
    };

    return NextResponse.json({
      success: true,
      data: toPatientResponse(merged),
    });
  } catch (error) {
    console.error("PUT /me error:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}
