"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/app/assets/logo_white.svg";
import notification from "@/app/assets/notification.svg";
import avatar from "@/app/assets/avatar.svg";
import { useAuth } from "@/app/lib/auth-context";
import { useRouter } from "next/navigation";
import { jsGetProfilePicture } from "@/app/api/auth-jobseeker.api";
import Loading from "@/app/loading";
import { UserRole } from "@/app/lib/enums";
import { ChevronDown } from "lucide-react";

type DashboardnavProps = {
  onToggleMenu: () => void;
};

// Dashboard navigation bar shown on jobseeker and employer dashboards
const Dashboardnav: React.FC<DashboardnavProps> = ({ onToggleMenu }) => {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
  } = useAuth();

  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Handles logging the current user out from the dashboard
  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  // Handles navigation to the appropriate profile page
  const handleProfileNavigation = () => {
    const profilePath =
      user?.role === UserRole.EMPLOYER
        ? "/pages/employer/profile"
        : "/pages/jobseeker/profile";
    router.push(profilePath);
    setIsProfileMenuOpen(false);
  };

  // Toggles the visibility of the profile dropdown menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      // removed accidental leading space in the path
      router.push("/pages/jobseeker/auth/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;

    const loadDashboardData = async () => {
      try {
        if (profile?.jobSeeker?.profilePictureId) {
          try {
            const pictureData = await jsGetProfilePicture();
            setProfilePictureUrl(pictureData.signedUrl);
          } catch {
            console.log("No profile picture found");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthLoading, isAuthenticated, profile?.jobSeeker?.profilePictureId]);

  // Close the profile dropdown when clicking outside the menu
  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isProfileMenuOpen]);

  if (isAuthLoading || isDashboardLoading) {
    return <Loading text="Jobstack..."  />;
  }

  return (
    <div className="w-full flex items-center justify-between px-4 md:px-0 mb-6">
      {/* Logo */}
      <Image src={logo} alt="logo image" className="h-8 w-auto" />

      <div className="flex items-center gap-3">
        {/* Hide sign up on very small screens to save space */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer text-white text-sm font-medium"
        >
          Logout
        </button>

        {/* Notification + profile */}
        <div className="flex items-center gap-3">
          <Image
            src={notification}
            alt="notification icon"
            className="bg-sky-50 p-2 w-9 h-9 rounded-full cursor-pointer hover:bg-sky-100 transition-colors"
          />

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 bg-white/30 px-3 py-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer text-sm text-white"
            >
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt={user?.firstName || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="hidden sm:inline">
                {user?.firstName || "Profile"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white py-2 text-sm text-slate-700 shadow-xl ring-1 ring-black/5 z-20">
                <button
                  onClick={handleProfileNavigation}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors md:hidden"
          onClick={onToggleMenu}
          aria-label="Toggle navigation"
        >
          {/* simple icon; replace with an SVG if you have one */}
          <span className="text-xl leading-none">☰</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboardnav;
