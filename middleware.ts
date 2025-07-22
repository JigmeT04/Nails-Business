// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Make sure the function is exported and named exactly "middleware"
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!sessionToken) {
    return NextResponse.redirect(loginUrl);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const encodedSecret = new TextEncoder().encode(secret);
    await jwtVerify(sessionToken, encodedSecret);

    return NextResponse.next();
  } catch (error) {
    // If the token is invalid (expired, etc.), redirect to login
    return NextResponse.redirect(loginUrl);

  }
}

// The config object tells the middleware which paths to run on
export const config = {
  matcher: ["/dashboard/:path*"],
};