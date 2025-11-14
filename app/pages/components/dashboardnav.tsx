"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo_white.svg";
import notification from "@/app/assets/notification.svg";
import { useAuth } from "@/app/lib/auth-context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const Dashboardnav = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push(" /pages/jobseeker/auth/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Load dashboard data once authenticated
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    const loadDashboardData = async () => {
      try {
        // simulate data fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthLoading, isAuthenticated]);

  // SHOW LOADER WHILE AUTH OR DASHBOARD IS LOADING
  if (isAuthLoading || isDashboardLoading) {
    return <Loading text="Jobstack..." />;
  }

  return (
    <div className=" w-full flex justify-between px-4 items-center mb-10">
      <Image src={logo} alt="logo image" className="" />
      <div className="flex items-center w-1/6">
        <div className="flex items-center w-full">
          <Image
            src={notification}
            alt="notification icon"
            className=" w bg-sky-50 p-2 w-10 h-10 rounded-full mr-6 cursor-pointer hover:bg-sky-100 transition-colors"
          />
          <button
            onClick={() => router.push("/pages/jobseeker/profile")}
            className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer"
          >
            {user?.firstName || "Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboardnav;
