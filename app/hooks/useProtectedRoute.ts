/**
 * Hook for protecting routes with role-based access
 * This is a simpler alternative to the ProtectedRoute component
 * Use this in your page components directly
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { UserRole } from "@/app/lib/enums";

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { allowedRoles, requireAuth = true, redirectTo } = options;
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  // Track when auth context has finished its initial hydration
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return;
    if (!hasCheckedAuth) {
      setHasCheckedAuth(true);
    }

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
    hasCheckedAuth,
  ]);

  // Guard should report loading until auth check has completed once
  const guardLoading = isLoading || !hasCheckedAuth;

  return {
    isLoading: guardLoading,
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
    case UserRole.EMPLOYER:
      return "/pages/employer/dasboard";
    case UserRole.JOB_SEEKER:
      return "pages/jobseeker/dashboard";
    case UserRole.ADMIN:
      return "/admin/dashboard";
    default:
      return "/";
  }
}

function getLoginPathForRole(role?: UserRole): string {
  switch (role) {
    case UserRole.EMPLOYER:
      return " /pages/employer/auth/login";
    case UserRole.JOB_SEEKER:
      return "/pages/jobseeker/auth/login";
    case UserRole.ADMIN:
      return "/auth/admin/login";
    default:
      return " /pages/employer/auth/login";
  }
}
