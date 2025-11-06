"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthGuard({
  children,
  redirectTo = "/auth/employer/login",
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  ),
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
