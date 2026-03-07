import { NextResponse } from "next/server";
import users from "@/data/user";

// No DB: registration uses hardcoded data. If PHIN exists in data, "register" = login.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const existing = users.find((u: any) => u.phin === body.phin);

    if (existing) {
      // Treat as login with provided password
      if (existing.password !== body.password) {
        return NextResponse.json(
          {
            success: false,
            message: "PHIN already registered - use correct password",
          },
          { status: 400 }
        );
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set("patientId", String(existing.id), {
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
        message: "Use demo account: PHIN 99, password: password",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Patient registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
