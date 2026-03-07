import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveAccess } from "@/MedTrack/lib/accessTokenStore";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    const token =
      "MED-" +
      Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    saveAccess({
      token,
      patientId,
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      data: { token, expiresAt: expiresAt.toISOString() },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { success: false, message: "Token generation failed" },
      { status: 500 },
    );
  }
}
