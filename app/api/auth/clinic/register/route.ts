import { NextResponse } from "next/server";
import clinics from "@/data/clinic";

// No DB: use hardcoded clinic. If clinicId exists, "register" = login.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const existing = clinics.find((c: any) => c.clinicId === body.clinicId);

    if (existing) {
      if (existing.password !== body.password) {
        return NextResponse.json(
          {
            success: false,
            message: "Clinic ID already registered - use correct password",
          },
          { status: 400 }
        );
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set("clinicId", existing.clinicId, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Use demo clinic: ID clinic1, password: password",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Clinic registration error:", error);
    return NextResponse.json(
      { success: false, message: "Clinic registration failed" },
      { status: 500 }
    );
  }
}
