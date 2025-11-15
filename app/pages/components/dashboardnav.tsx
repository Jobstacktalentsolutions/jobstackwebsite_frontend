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

type DashboardnavProps = {
    onToggleMenu: () => void;
};

const Dashboardnav: React.FC<DashboardnavProps> = ({ onToggleMenu }) => {
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

    const handleSignup = () => {
        const signupPath =
            user?.role === UserRole.EMPLOYER
                ? "/pages/employer/auth/signUp"
                : "/pages/jobseeker/auth/signUp";

        clearAuthState();
        router.push(signupPath);
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

    if (isAuthLoading || isDashboardLoading) {
        return <Loading text="Jobstack..." />;
    }

    return (
        <div className="w-full flex items-center justify-between px-4 md:px-0 mb-6">
            {/* Logo */}
            <Image src={logo} alt="logo image" className="h-8 w-auto" />

            <div className="flex items-center gap-3">
                {/* Hide sign up on very small screens to save space */}
                <button
                    onClick={handleSignup}
                    className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer text-white text-sm font-medium"
                >
                    Sign up
                </button>

                {/* Notification + profile */}
                <div className="flex items-center gap-3">
                    <Image
                        src={notification}
                        alt="notification icon"
                        className="bg-sky-50 p-2 w-9 h-9 rounded-full cursor-pointer hover:bg-sky-100 transition-colors"
                    />

                    <button
                        onClick={() => {
                            const profilePath =
                                user?.role === UserRole.EMPLOYER
                                    ? "/pages/employer/profile"
                                    : "/pages/jobseeker/profile";
                            router.push(profilePath);
                        }}
                        className="hidden xs:flex items-center gap-2 bg-white/30 px-3 py-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer text-sm"
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
