/**
 * Hook for protecting routes with role-based access
 * This is a simpler alternative to the ProtectedRoute component
 * Use this in your page components directly
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";

export type UserRole = "EMPLOYER" | "JOB_SEEKER" | "ADMIN";

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { allowedRoles, requireAuth = true, redirectTo } = options;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      const loginPath = redirectTo || getLoginPathForRole(allowedRoles?.[0]);
      router.replace(loginPath);
      return;
    }

    // Check role-based access
    if (isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.role as UserRole;

      if (!userRole || !allowedRoles.includes(userRole)) {
        const fallbackPath = getRedirectPathForRole(userRole);
        router.replace(redirectTo || fallbackPath);
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    allowedRoles,
    requireAuth,
    redirectTo,
    router,
  ]);

  return {
    isLoading,
    isAuthenticated,
    user,
    isAuthorized:
      isAuthenticated &&
      (!allowedRoles ||
        allowedRoles.length === 0 ||
        allowedRoles.includes(user?.role as UserRole)),
  };
}

function getRedirectPathForRole(role?: UserRole): string {
  switch (role) {
    case "EMPLOYER":
      return "/pages/employer/dasboard";
    case "JOB_SEEKER":
      return "pages/jobseeker/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

function getLoginPathForRole(role?: UserRole): string {
  switch (role) {
    case "EMPLOYER":
      return " /pages/employer/auth/login";
    case "JOB_SEEKER":
      return "/pages/jobseeker/auth/login";
    case "ADMIN":
      return "/auth/admin/login";
    default:
      return " /pages/employer/auth/login";
  }
}
