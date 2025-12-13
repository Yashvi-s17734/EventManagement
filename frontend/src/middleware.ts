import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 🚫 Logged-in user should NOT see login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚫 Not logged-in user should NOT see protected pages
  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/bookings") ||
      pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login", "/bookings/:path*"],
};
