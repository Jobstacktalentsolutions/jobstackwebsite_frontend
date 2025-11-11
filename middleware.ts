import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  "/pages/employer": ["RECRUITER"],
  "/auth/employer/profile": ["RECRUITER"],
  "/auth/employer/profile/companyProfile": ["RECRUITER"],
  "/dashboard": ["JOB_SEEKER"],
  "/jobseeker/auth/profile": ["JOB_SEEKER"],
  "/admin": ["ADMIN"],
};

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/jobs",
  "/blog",
  "/postajob",
  " /pages/employer/auth/login",
  "/pages/employer/auth/signUp",
  "/pages/employer/auth/forgetPassword",
  "/jobseeker/auth/login",
  "/jobseeker/auth/signUp",
  "/jobseeker/auth/forgetPassword",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get auth tokens from cookies
  const accessToken = request.cookies.get("jobstack_access_token")?.value;
  const userRole = request.cookies.get("jobstack_user_role")?.value;

  // Check if route requires authentication
  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    // Route requires authentication
    if (!accessToken) {
      // Not authenticated - redirect to appropriate login
      const requiredRoles =
        protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
      const loginPath = getLoginPathForRole(requiredRoles[0]);
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Check role authorization
    const requiredRoles =
      protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
    if (userRole && !requiredRoles.includes(userRole)) {
      // Wrong role - redirect to appropriate dashboard
      const dashboardPath = getDashboardPathForRole(userRole);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

function getLoginPathForRole(role: string): string {
  switch (role) {
    case "RECRUITER":
      return " /pages/employer/auth/login";
    case "JOB_SEEKER":
      return "/jobseeker/auth/login";
    case "ADMIN":
      return "/auth/admin/login";
    default:
      return " /pages/employer/auth/login";
  }
}

function getDashboardPathForRole(role: string): string {
  switch (role) {
    case "RECRUITER":
      return "/pages/employer";
    case "JOB_SEEKER":
      return "/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
