import { NextResponse } from "next/server";
import clinics from "@/data/clinic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clinic = clinics.find((c: any) => c.clinicId === body.clinicId);

    if (!clinic) {
      return NextResponse.json(
        { success: false, message: "Invalid clinic ID" },
        { status: 400 }
      );
    }

    if (clinic.password !== body.password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("clinicId", clinic.clinicId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Clinic login error:", error);
    return NextResponse.json(
      { success: false, message: "Clinic login failed" },
      { status: 500 }
    );
  }
}
