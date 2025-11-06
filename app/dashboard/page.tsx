"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to home page
    // In the future, this will be the actual dashboard
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to JobStack!
        </h1>
        <p className="text-gray-600">Redirecting you to the dashboard...</p>
      </div>
    </div>
  );
}
