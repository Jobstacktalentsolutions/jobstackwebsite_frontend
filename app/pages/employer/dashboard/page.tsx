"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import GoBackButton from "@/app/pages/components/gobackbutton";
import Dashboardnav from "@/app/pages/components/dashboardnav";
import { useAuth } from "@/app/lib/auth-context";
import Loading from "@/app/loading";
import { empGetCompanyLogo } from "@/app/api/auth-employer.api";
import avatar from "@/app/assets/avatar.svg";

import {
  BriefcaseBusinessIcon,
  Building2,
  HomeIcon,
  Settings,
} from "lucide-react";
import { CategoryOutlined } from "@mui/icons-material";

const EmployerDashboard = () => {
  const { user, isLoading, isAuthenticated, profile } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );

  // Fetch profile picture when component loads
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const loadProfilePicture = async () => {
      try {
        const pictureData = await empGetCompanyLogo();
        setProfilePictureUrl(pictureData.signedUrl);
      } catch (err) {
        // Profile picture might not exist, that's okay
        setProfilePictureUrl(null);
      }
    };

    loadProfilePicture();
  }, [isAuthenticated, isLoading, profile?.employer]);

  // Show loading only while auth is initializing
  // Dashboard doesn't require profile data, only user info (user?.firstName)
  // Don't wait for profile to load as it's fetched asynchronously and not needed here
  if (isLoading || !isAuthenticated) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div>
      {/* <GoBackButton /> */}
      <div className="flex ">
        <div className="bg-blue text-white w-full px-25 py-10 rounded-br-[100px]">
          {" "}
          <Dashboardnav />
          <ul className="list-none  flex justify-between cursor-pointer my-4 w-4/5">
            <li className="flex items-center text-base font-light hover:bg-white/10 hover:rounded-full px-5 py-2">
              <HomeIcon className="mr-2" /> Overview
            </li>
            <li className="flex items-center text-base font-light hover:bg-white/10 hover:rounded-full px-5 py-2">
              <BriefcaseBusinessIcon className="mr-2" /> Explore jobs
            </li>
            <li className="flex items-center text-base font-light hover:bg-white/10 hover:rounded-full px-5 py-2">
              <CategoryOutlined className="mr-2" />
              My Applications
            </li>
            <li className="flex items-center text-base font-light hover:bg-white/10 hover:rounded-full px-5 py-2">
              <Building2 className="mr-2" /> Job Recommendations
            </li>
            <li className="flex items-center text-base font-light hover:bg-white/10 hover:rounded-full px-5 py-2">
              <Settings className="mr-2" /> Settings
            </li>
          </ul>
          <div className="my-5">
            <h2 className="text-4xl mt-5">
              <span className="text-white/50">Welcome,</span> {user?.firstName}
            </h2>
          </div>
        </div>
      </div>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-sm font-semibold text-white">
              JS
            </div>
            <span className="font-semibold text-slate-900">Job Stack</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 sm:flex">
            <button className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
              Candidate
            </button>
            <button className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-slate-100">
              Jobs
            </button>
            <button className="rounded-full px-3 py-1.5 text-sm font-medium hover:bg-slate-100">
              Messages
            </button>
            {profilePictureUrl ? (
              <Image
                src={profilePictureUrl}
                alt={user?.firstName || "Profile"}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        {/* KPI cards */}
        <section className="grid gap-4 md:grid-cols-5">
          {/* Jobs Applied To */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Jobs Applied To
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <rect x="3" y="8" width="18" height="11" rx="2" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  <path d="M3 13h18" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">2</p>
          </div>

          {/* Upcoming Interviews */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Upcoming Interviews
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">2</p>
          </div>

          {/* Jobs Accepted */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Jobs Accepted
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-sky-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">1</p>
          </div>

          {/* Profile Views */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Profile Views
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">This week</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-fuchsia-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 19.2c1.4-2.4 3.7-3.8 7-3.8s5.6 1.4 7 3.8" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">15</p>
          </div>

          {/* Saved Jobs */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Saved Jobs
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path d="M7 4.5A2.5 2.5 0 0 1 9.5 2H15a2 2 0 0 1 2 2v16l-5-3-5 3V4.5z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">5</p>
          </div>
        </section>

        {/* Roles that match your profile */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Roles That Match Your Profile
            </h2>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700">
              <span>View All</span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Job card 1 */}
            <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-800">
                      Surulere, Lagos
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />1 day
                  ago
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Childminder / Nanny
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  We need a caring and patient nanny for our 2 year old son
                  while we are at work.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  On site
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  Monday – Friday (7am – 5pm)
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800">
                  ₦35,000 / month
                </span>
              </div>
            </article>

            {/* Job card 2 */}
            <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-800">
                      Victoria Island, Lagos
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />3 days
                  ago
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Sales Representative
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  Seeking an enthusiastic person for our cosmetics store. Must
                  have a flair for beauty and excellent people skills.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  On site
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  Full time (9am – 5pm)
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800">
                  ₦40,000 / month
                </span>
              </div>
            </article>

            {/* Job card 3 */}
            <article className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-8 w-8 rounded-lg bg-slate-200" />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-800">
                      Ikeja, Lagos
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                      <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-slate-400" />1 week
                  ago
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Data Entry Clerk
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  Looking for detail oriented individuals for data management
                  tasks. Ideal for those skilled with spreadsheets and typing.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  Remote
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                  Part time (Flexible hours)
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800">
                  ₦25,000 / month
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* Application Journey + Profile Strength */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          {/* Application Journey */}
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Your Application Journey
              </h2>
              <button className="whitespace-nowrap rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100">
                Track All Applications
              </button>
            </div>

            <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
              <button className="rounded-full bg-slate-900 px-3 py-1.5 text-white">
                Applied
              </button>
              <button className="rounded-full bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
                Interviews
              </button>
              <button className="rounded-full bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
                Offers
              </button>
            </div>

            <div className="mt-3 space-y-4">
              {/* Applied row */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M7 9h10" />
                    </svg>
                    Applied
                  </span>
                  <span className="text-[11px]">10 applications</span>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-700">
                      Customer Service Rep
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      22nd October, 2025 · 9:30AM
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-700">
                      Retail Assistant
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      18th October, 2025 · 8:37AM
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-700">
                      Office Assistant
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      ProBiz Ltd
                    </p>
                  </div>
                </div>
              </div>

              {/* Upcoming interviews */}
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M8 3v4M16 3v4M3 11h18" />
                    </svg>
                    Upcoming Interviews
                  </span>
                  <span className="text-[11px]">2 scheduled</span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-medium text-slate-700">
                      Customer Service Rep · Lagos
                    </span>
                    <span className="text-slate-500">
                      24th October, 2025 · 10:00AM
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-medium text-slate-700">
                      Office Assistant · ProBiz Ltd
                    </span>
                    <span className="text-slate-500">
                      27th October, 2025 · 1:30PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Strength */}
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Profile Strength
            </h2>
            <p className="text-sm text-slate-600">
              You are most likely to be hired for:
            </p>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                OA
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  Office Assistant
                </span>
                <span className="text-xs text-slate-500">ProBiz Ltd</span>
              </div>
            </div>

            <div className="mt-2 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Profile completeness</span>
                <span className="text-xs font-medium text-emerald-600">
                  80%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-4/5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-xs text-slate-500">
                Add more skills and work experience to improve your chances.
              </div>
            </div>

            <button className="mt-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800">
              Improve Profile
            </button>
          </section>
        </section>
      </main>
    </div>
  );
};

export default EmployerDashboard;
