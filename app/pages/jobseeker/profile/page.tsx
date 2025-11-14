"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import profileImage from "@/app/assets/profileImage.svg";
import editIcon from "@/app/assets/editIcon.svg";
import threedots from "@/app/assets/threedots.svg";
import calendar from "@/app/assets/calendar.svg";
import location from "@/app/assets/locationPin.svg";
import documentIcon from "@/app/assets/documentIcon.svg";
import { useAuth } from "@/app/lib/auth-context";
import {
  fetchJobSeekerProfile,
  type JobSeekerProfile,
} from "@/app/lib/profile-completion";
import { jsGetCvDocument } from "@/app/api/auth-jobseeker.api";
import { ApprovalStatus, UserRole } from "@/app/lib/enums";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import Loading from "@/app/loading";

const tagBase =
  "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700";

const cardBase =
  "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6";

const sectionTitle =
  "flex items-center justify-between mb-3 text-sm font-semibold text-slate-900";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading: isAuthLoading } = useProtectedRoute({
    allowedRoles: [UserRole.JOB_SEEKER],
    requireAuth: true,
  });
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [cvDocument, setCvDocument] = useState<{
    document: {
      id: string;
      fileName: string;
      originalName: string;
      mimeType: string;
      size: number;
      type: string;
      description?: string;
      createdAt: string;
    };
    signedUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await fetchJobSeekerProfile();
        setProfile(profileData);

        // Try to fetch CV document if it exists
        if (profileData.cvDocumentId) {
          try {
            const cvData = await jsGetCvDocument();
            setCvDocument(cvData);
          } catch (err) {
            // CV might not exist, that's okay
            console.log("No CV document found");
          }
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError(err?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const getApprovalStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case ApprovalStatus.PENDING:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case ApprovalStatus.REJECTED:
        return (
          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
            Not Started
          </span>
        );
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) {
      return `₦${min.toLocaleString()} – ₦${max.toLocaleString()} / month`;
    }
    if (min) {
      return `₦${min.toLocaleString()}+ / month`;
    }
    if (max) {
      return `Up to ₦${max.toLocaleString()} / month`;
    }
    return "Not specified";
  };

  const formatLocation = () => {
    if (profile?.city && profile?.state) {
      return `${profile.city}, ${profile.state}`;
    }
    if (profile?.preferredLocation) {
      return profile.preferredLocation;
    }
    if (profile?.city) {
      return profile.city;
    }
    if (profile?.state) {
      return profile.state;
    }
    return "Not specified";
  };

  if (isAuthLoading || isLoading) {
    return <Loading text="Loading profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Profile not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "User";
  const displayLocation = formatLocation();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-sky-900 to-sky-700 px-6 pb-10 md:pb-24 pt-8 mb-10 md:px-10 md:mb-20">
          {/* Decorative stripes, optional */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 opacity-20">
            <div className="h-full bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
          </div>

          <header className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between h-full">
            {/* Left: avatar and basic info */}
            <div className="flex text-[#717680] md:absolute w-full items-start gap-4 md:gap-6 bottom-0 md:-bottom-[150px]">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/70 bg-slate-200 md:h-24 md:w-24">
                {profile.profilePictureUrl ? (
                  <Image
                    src={profile.profilePictureUrl}
                    alt={fullName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image src={profileImage} alt={fullName} />
                )}
              </div>

              <div className="text-white">
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <h1 className="text-2xl font-semibold md:text-3xl">
                    {fullName}
                  </h1>
                  {getApprovalStatusBadge(profile.approvalStatus)}
                </div>
                {profile.jobTitle && (
                  <p className="mt-1 text-white md:text-[#717680] text-sm md:text-sm">
                    {profile.jobTitle}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Image src={location} alt="location" width={16} height={16} />
                  <p className="text-xs text-white md:text-[#717680] md:text-sm">
                    {displayLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex w-full flex-wrap items-center gap-3 justify-end">
              <button
                onClick={() => router.push("/pages/jobseeker/auth/profile")}
                className="flex items-center rounded-lg bg-white px-4 py-2 text-xs font-medium text-blue backdrop-blur hover:bg-white/80"
              >
                <p>Edit Profile</p>
                <Image
                  className="mx-4"
                  src={editIcon}
                  alt="edit icon"
                  width={15}
                  height={15}
                />
              </button>
              <button className="rounded-lg border border-white/70 bg-[#2572A7] px-4 py-2 text-xs font-medium text-white hover:bg-white/80">
                Share Profile
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white hover:bg-white/90"
                aria-label="More options"
              >
                <Image src={threedots} alt="three dots" />
              </button>
            </div>
          </header>
        </div>

        {/* Content */}
        <div className="px-4 pb-8 md:px-8 md:pb-10">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left column */}
            <div className="md:col-span-2 space-y-6">
              {/* About me */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">About me</span>
                  <button
                    onClick={() => router.push("/pages/jobseeker/auth/profile")}
                  >
                    <Image src={editIcon} alt="edit icon" />
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-[#717680]">
                  {profile.brief ||
                    profile.bio ||
                    "No bio available. Click edit to add your bio."}
                </p>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Quick facts */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Quick Facts</span>
                  <button
                    onClick={() => router.push("/pages/jobseeker/auth/profile")}
                  >
                    <Image src={editIcon} alt="edit icon" />
                  </button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Preferred Location
                    </p>
                    <p className="mt-1 text-slate-800">{displayLocation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Expected Salary
                    </p>
                    <p className="mt-1 text-slate-800">
                      {formatSalary(
                        profile.minExpectedSalary,
                        profile.maxExpectedSalary
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Skills</span>
                  <button
                    onClick={() => router.push("/pages/jobseeker/auth/profile")}
                  >
                    <Image src={editIcon} alt="edit icon" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.userSkills && profile.userSkills.length > 0 ? (
                    profile.userSkills.map((userSkill) => (
                      <span key={userSkill.id} className={tagBase}>
                        {userSkill.skill?.name || "Unknown"}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No skills added yet
                    </p>
                  )}
                </div>
              </section>

              {/* Verified documents */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Verified Documents</span>
                  <button
                    onClick={() => router.push("/pages/jobseeker/auth/profile")}
                  >
                    <Image src={editIcon} alt="edit icon" />
                  </button>
                </div>

                <ul className="space-y-2 text-sm text-slate-800">
                  {cvDocument && (
                    <li className="flex items-center gap-2">
                      <Image
                        src={documentIcon}
                        alt="document"
                        width={16}
                        height={16}
                      />
                      <span>
                        {cvDocument.document.originalName ||
                          cvDocument.document.fileName}
                      </span>
                    </li>
                  )}
                  {!cvDocument && (
                    <li className="text-slate-500">No documents uploaded</li>
                  )}
                </ul>

                <button
                  onClick={() => router.push("/pages/jobseeker/auth/profile")}
                  className="mt-4 w-full rounded-xl bg-sky-50 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-100"
                >
                  Upload New Document
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
