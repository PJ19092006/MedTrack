import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const patientId = request.cookies.get("patientId");
  const clinicId = request.cookies.get("clinicId");

  const path = request.nextUrl.pathname;

  // Protect patient dashboard
  if (path.startsWith("/dashboard") && !patientId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect clinic area
  if (path.startsWith("/clinic") && !clinicId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/clinic/:path*"],
};
