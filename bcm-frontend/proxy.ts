import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only these exact paths are public
const publicPaths = [
  '/',
  '/auth/login',
  // '/about', // Add if needed
  // '/contact', // Add if needed
];

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return publicPaths.includes(pathname);
}

/**
 * Get auth token from cookies
 */
function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get("token")?.value ?? null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication
  const token = getAuthToken(request);

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};