import { NextResponse } from "next/server";
import users from "@/data/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = users.find((u: any) => u.phin === body.phin);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid PHIN" },
        { status: 400 }
      );
    }

    if (user.password !== body.password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("patientId", String(user.id), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Patient login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
