"use client";
import React from "react";
import Image from "next/image";
import { StatCard } from "@/app/pages/components/statcard";
import { ApplicationJourney } from "@/app/pages/components/applicationJourney";
import avatar from "@/app/assets/avatar.svg";
import ProfileStrength from "@/app/pages/components/profileStrength";
import JobCard from "@/app/pages/components/jobcard";
import Dashboardnav from "@/app/pages/components/dashboardnav";
import { useAuth } from "@/app/lib/auth-context";
import Loading from "@/app/loading";
import orangebriefcase from "@/app/assets/orangeBriefcase.svg";
import greenverifed from "@/app/assets/greenverified_dash.svg";
import calendar from "@/app/assets/greencalendar.svg";
import purpleuser from "@/app/assets/purpleuser.svg";
import yellowsaved from "@/app/assets/yellowsaved.svg";

import {
  BriefcaseBusinessIcon,
  Building2,
  HomeIcon,
  Settings,
} from "lucide-react";
import { CategoryOutlined } from "@mui/icons-material";

export default function CandidateDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <Loading text="Loading dashboard..." />;
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}

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

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6">
        {/* KPI cards */}
        <section className="grid gap-4 md:grid-cols-5">
          <StatCard
            label="Jobs Applied To"
            value={2}
            icon={<Image src={orangebriefcase} alt="briefcase" />}
            iconBgClassName="bg-orange-50"
          />

          <StatCard
            label="Upcoming Interviews"
            value={2}
            icon={<Image src={calendar} alt="calendar" />}
            iconBgClassName="bg-emerald-50"
          />

          <StatCard
            label="Jobs Accepted"
            value={1}
            icon={<Image src={greenverifed} alt="green verification" />}
            iconBgClassName="bg-sky-50"
          />

          <StatCard
            label="Profile Views"
            subtitle="This week"
            value={15}
            icon={<Image src={purpleuser} alt="green verification" />}
            iconBgClassName="bg-fuchsia-50"
          />

          <StatCard
            label="Saved Jobs"
            value={5}
            icon={<Image src={yellowsaved} alt="saved icon" />}
            iconBgClassName="bg-amber-50"
          />
        </section>

        {/* Roles That Match Your Profile (same as before, omitted for brevity if you like) */}
        <h2 className="text-4xl">Roles that match your profile</h2>
        <div className=" grid md:grid-cols-3 gap-6">
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
        </div>

        {/* Application Journey + Profile Strength */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <ApplicationJourney />
          <ProfileStrength
            avatarSrc={avatar}
            onEdit={() => console.log("Edit clicked")}
            items={[
              { label: "Verified Government ID", percent: 50 },
              { label: "Profile Photo (Clear headshot)", percent: 90 },
              {
                label: "Detailed Work Experience (At least one role)",
                percent: 85,
              },
              { label: "CV/Resume Uploaded", percent: 80 },
              { label: "Educational Background Filled", percent: 95 },
              { label: "Profile Bio/Summary Written", percent: 75 },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
