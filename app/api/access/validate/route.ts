import { NextResponse } from "next/server";
import { findAccessByToken } from "@/MedTrack/lib/accessTokenStore";
import users from "@/data/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 },
      );
    }

    const access = findAccessByToken(token);

    if (!access || access.revoked) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 400 },
      );
    }

    if (new Date(access.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 400 },
      );
    }

    const user = users.find(
      (u: any) =>
        String(u.id) === access.patientId || u.phin === access.patientId,
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 },
      );
    }

    const userWithHistory = user as typeof user & {
      medicalHistory?: unknown[];
    };
    const patientData = {
      _id: String(user.id),
      phin: user.phin,
      name: user.name,
      dob: user.dob,
      conditions: user.conditions || [],
      vaccines: user.vaccines || [],
      medicalHistory: userWithHistory.medicalHistory || [],
    };

    return NextResponse.json({
      success: true,
      data: patientData,
    });
  } catch (error) {
    console.error("VALIDATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Validation failed" },
      { status: 500 },
    );
  }
}
