import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeAccess } from "@/MedTrack/lib/accessTokenStore";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const patientId = cookieStore.get("patientId")?.value;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    if (body.token) {
      revokeAccess(body.token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token revoke error:", error);
    return NextResponse.json(
      { success: false, message: "Revoke failed" },
      { status: 500 },
    );
  }
}
