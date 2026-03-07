import { NextResponse } from "next/server";
import users from "@/data/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // No DB: return success with mock data (not persisted)
    const mock = {
      _id: "test",
      name: body.name || "Test",
      dob: body.dob || new Date().toISOString(),
      conditions: body.conditions || [],
      vaccines: body.vaccines || [],
      medicalHistory: body.medicalHistory || [],
    };
    return NextResponse.json({ success: true, data: mock });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create patient" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Patient ID required" },
        { status: 400 }
      );
    }

    const user = users.find((u: any) => String(u.id) === id || u.phin === id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const u = user as typeof user & { medicalHistory?: unknown[] };
    const patient = {
      _id: String(user.id),
      phin: user.phin,
      name: user.name,
      dob: user.dob,
      conditions: user.conditions || [],
      vaccines: user.vaccines || [],
      medicalHistory: u.medicalHistory || [],
    };

    return NextResponse.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching patient" },
      { status: 500 }
    );
  }
}
