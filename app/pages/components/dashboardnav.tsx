"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo_white.svg";
import notification from "@/app/assets/notification.svg";
import avatar from "@/app/assets/avatar.svg";
import { useAuth } from "@/app/lib/auth-context";
import { useRouter } from "next/navigation";
import { jsGetProfilePicture } from "@/app/api/auth-jobseeker.api";
import Loading from "@/app/loading";
import { UserRole } from "@/app/lib/enums";

const Dashboardnav = () => {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading: isAuthLoading,
    clearAuthState,
  } = useAuth();
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Handle signup - clears all auth data and navigates to signup page
  const handleSignup = () => {
    // Determine signup path before clearing state
    const signupPath =
      user?.role === UserRole.EMPLOYER
        ? "/pages/employer/auth/signUp"
        : "/pages/jobseeker/auth/signUp";
    // Clear all cookies and auth state
    clearAuthState();
    // Navigate to signup page
    router.push(signupPath);
  };

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
        // Fetch profile picture if it exists
        if (profile?.jobSeeker?.profilePictureId) {
          try {
            const pictureData = await jsGetProfilePicture();
            setProfilePictureUrl(pictureData.signedUrl);
          } catch (err) {
            // Profile picture might not exist, that's okay
            console.log("No profile picture found");
          }
        }
        // simulate data fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthLoading, isAuthenticated, profile?.jobSeeker?.profilePictureId]);

  // SHOW LOADER WHILE AUTH OR DASHBOARD IS LOADING
  if (isAuthLoading || isDashboardLoading) {
    return <Loading text="Jobstack..." />;
  }

  return (
    <div className=" w-full flex justify-between px-4 items-center mb-10">
      <Image src={logo} alt="logo image" className="" />
      <div className="flex items-center gap-4">
        <button
          onClick={handleSignup}
          className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer text-white font-medium"
        >
          Sign up
        </button>
        <div className="flex items-center">
          <Image
            src={notification}
            alt="notification icon"
            className=" w bg-sky-50 p-2 w-10 h-10 rounded-full mr-6 cursor-pointer hover:bg-sky-100 transition-colors"
          />
          <button
            onClick={() => {
              const profilePath =
                user?.role === UserRole.EMPLOYER
                  ? "/pages/employer/profile"
                  : "/pages/jobseeker/profile";
              router.push(profilePath);
            }}
            className="flex items-center gap-2 bg-white/30 px-3 py-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer"
          >
            {profilePictureUrl ? (
              <Image
                src={profilePictureUrl}
                alt={user?.firstName || "Profile"}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src={avatar}
                alt="Avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{user?.firstName || "Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboardnav;
