import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ If logged in, don't allow going to login again
  if (token && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Allow public booking detail pages (QR scan)
  if (pathname.startsWith("/bookings/")) {
    return NextResponse.next();
  }

  // 🔒 Protect home page
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/bookings/:path*"],
};
