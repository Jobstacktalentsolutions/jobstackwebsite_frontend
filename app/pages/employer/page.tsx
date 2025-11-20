"use client";
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import HowItWorks from "../components/howItWorks";
import bag from "@/app/assets/bag.svg";
import book from "@/app/assets/book.svg";
import cake from "@/app/assets/cake.svg";
import shop from "@/app/assets/shop.svg";
import tech from "@/app/assets/tech.svg";
import house from "@/app/assets/house.svg";
import office from "@/app/assets/office.svg";
import tinystar from "@/app/assets/tinyStar.svg";
import solutions from "@/app/assets/solutions.svg";
import hero from "@/app/assets/employersheroimg.svg";
import dummyImage from "@/app/assets/dummyImage.png";
import { Hospital } from "lucide-react";
import Footer from "../components/footer";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import Link from 'next/link';
import logo from '@/app/assets/logo_white.svg';

function EmployerDashboard() {
  const [open, setOpen] = useState(false);

  // Close on viewport upsize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const router = useRouter();
  const { user } = useAuth(); // Assume `user` is null if not logged in

  const handleCTA = (path) => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };
  const industries = [
    [
      cake,
      "For Restaurants & Hotels",
      "List your role requirements in minutes. It's free to get started.",
    ],
    [
      shop,
      "For Retail & Sales",
      "Easily post your job openings and connect with local talent in no time.",
    ],
    [
      Hospital,
      "For Healthcare Providers",
      "Streamline your hiring and find qualified professionals quickly.",
    ],
    [
      tech,
      "For Tech Startups",
      "Attract innovative thinkers and expand your team effortlessly.",
    ],
    [
      bag,
      "For Skilled Trades",
      "Source drivers, technicians, electricians, and carpenters.",
    ],
    [
      office,
      "For Offices & Corporates",
      "Hire receptionists, data entry staff, accountants, and managers.",
    ],
    [
      book,
      "For Educational Institutions",
      "Post course details and requirements to attract the right teachers.",
    ],
    [
      house,
      "For Home & Personal Services",
      "Hire trustworthy individuals for domestic and personal needs.",
    ],
  ];
  return (
    <main className="min-h-screen font-sans text-slate-900 ">
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 bg-white/5  backdrop-blur-md border   px-6 shadow-lg z-50 border-b border-white/20 mb-5">
        <nav
          className="mx-auto flex max-w-7xl items-center  justify-between py-5 sm:px-6 lg:px-8   "
          aria-label="Primary"
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="TalentHub" className="h-8 w-auto" priority />

          </Link>

          {/* Desktop nav (center) */}
          <div className="hidden  md:flex md:justify-center ">
            <ul className="flex flex-col gap-3 md:gap-6 md:flex-row md:items-center">
              <li>
                <Link
                  className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                  href="/pages/employer/dashboard"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                  href="#"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                  href="#"
                >
                  Browse jobs
                </Link>
              </li>
              <li>
                <Link
                  className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                  href="#"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Right actions (desktop) */}
          <div className="hidden w-1/3  md:flex md:flex-end justify-end items-center gap-4 ">
            <Link className="text-green-500 font-medium" href="/">
              Jobseeker&rsquo;s dashboard
            </Link>
            <Link
              href="/pages/employer/auth/signUp"
              className="rounded-lg bg-[#E6F2F9] px-5 py-3 text-blue font-semibold"
            >
              Sign up
            </Link>
            <Link
              href=" /pages/employer/auth/login"
              className="rounded-lg bg-[#E6F2F9] px-5 py-3 text-blue font-semibold"
            >
              Log in
            </Link>
          </div>

          {/* Mobile toggler */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden inline-flex items-center rounded-md p-2 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor">
              {open ? (
                <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile sheet (matches mock) */}
        <div
          id="mobile-menu"
          className={[
            'md:hidden fixed inset-0 z-[60] transition-all duration-200 ease-out',
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          ].join(' ')}
        >
          {/* Backdrop (subtle) */}
          <div
            className="absolute inset-0 bg-black/5"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <div className="absolute inset-x-0 top-0 bg-white h-full">
            {/* Top bar with close */}
            <div className="flex items-center justify-end px-4 py-4 border-b border-slate-200">
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Centered nav items */}
            <div className="flex h-[calc(100%-56px)] flex-col items-center justify-start gap-8 pt-8">
              {/* Active Home pill */}
              <Link
                href="/"
                className="rounded-full bg-slate-100 px-6 py-2 text-slate-800 font-medium"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-slate-700"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="#"
                className="text-slate-700"
                onClick={() => setOpen(false)}
              >
                Browse jobs
              </Link>
              <Link
                href="#"
                className="text-slate-700"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>

              {/* Primary action */}
              <Link
                href="/pages/employer/auth/signUp"
                className="mt-6 inline-flex w-[220px] items-center justify-center rounded-2xl bg-[#2F76B6] px-6 py-3 text-white font-semibold shadow-[0_12px_30px_-8px_rgba(47,118,182,0.55)]"
              >
                Sign up
              </Link>
              <Link
                href="/auth/emplyer/login"
                className="mt-6 inline-flex w-[220px] items-center border-[2px] justify-center rounded-2xl text-[#2F76B6] px-6 py-3 bg-white font-semibold shadow-[0_12px_30px_-8px_rgba(47,118,182,0.55)]"
              >
                Log in
              </Link>

              {/* Employers link (green) */}
              <Link
                href="#"
                className="mt-2 text-emerald-600 font-semibold"
                onClick={() => setOpen(false)}
              >
                View the employer&apos;s dashboard
              </Link>
            </div>
          </div>
        </div >
      </header >

      {/* HERO */}
      <section className="bg-[#1e5b86] ">
        <div className="mx-auto  max-w-9xl px-6 md:px-10 py-20 md:py-30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 my-10 md:mx-20 ">
            <div className="text-white flex-col justify-center items-center md:flex-row md:items-center">
              <h1 className="text-3xl md:text-5xl  font-medium leading-tight text-center lg:text-start">
                Hire Quality Talent, <br className='hidden md:block' /> Fast.
              </h1>
              <p className="mt-4  text-white/80 font-light text-center lg:text-start">
                Post your job to thousands of verified, active job seekers.
                <br /> Fill your roles in days, not months.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="rounded-lg bg-white px-5 py-3 text-[#1e5b86]  shadow"
                  onClick={() => handleCTA('/employer/dashboard')}
                >
                  Post a Job for Free
                </button>
                <button
                  className="rounded-lg border border-white/60 px-5 py-3  text-white/90"
                  onClick={() => handleCTA('/employer/dashboard')}
                >
                  Schedule a Demo
                </button>
              </div>
            </div>
            <div className="relative max-w-xl">
              <div className=" p-3">
                <div className="relative rounded-4xl overflow-hidden  ">
                  <Image
                    src={hero}
                    alt="hero"
                    className="rounded-xl"
                    width={740}
                    height={500}
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 right-4 w-70 rounded-2xl bg-white p-4 text-black shadow-xl">
                <p className=" tracking-wide font-extralight text-black text-base">
                  Trusted by
                </p>
                <p className="text-3xl   my-4">8,000+</p>
                <p className="font-extralight text-base text-black ">
                  businesses across Nigeria, from startups to established
                  brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SOLUTIONS STRIP (icons grid) */}
      <section className="bg-[#1e5b86] text-white font-sans">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto mb-8 flex w-[158px] max-w-sm items-center justify-center gap-2 bg-white rounded-full px-3 py-4 text-black">
            <span>
              <Image src={tinystar} alt="tiny star" />
            </span>
            <span className="text-base font-medium">Testimonials</span>
          </div>
          <h2 className="text-center text-3xl font-medium tracking-normal  mb-4 md:text-5xl">
            Solutions for Your Business
          </h2>
          <p className="mt-1 text-center font-extralight text-white/70">
            Hire for Any Role, Any Sector
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 font-sans">
            {industries.map(([icon, title, desc], i) => (
              <div
                key={i}
                className="rounded-2xl p-5  flex flex-col items-center  justify-center transition-colors text-center  duration-200 font-sans"
              >
                <Image src={icon} alt={title} className="my-4 w-6 h-6" />
                <h3 className="text-base font-medium w-full font-sans">
                  {title}
                </h3>
                <p className="mt-2 text-sm font-sans text-white/80">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TALENT */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto mb-8 flex w-[148px] max-w-xs items-center justify-center gap-2 rounded-full border-gray-400 border px-5 py-4 ">
            <span>
              <Image src={tinystar} alt="tinystar" />
            </span>
            <span className="text-sm font-semibold">Talents</span>
          </div>
          <h2 className="  text-center text-5xl -tracking-normal my-5">
            Featured Talent Pool
          </h2>
          <p className="mt-1 text-center text-slate-500">
            Top Candidates Actively Looking
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article
                key={i}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center ">
                    <div className="h-4 w-5 rounded bg-[#2972a5] mx-1" />
                    <div>
                      <h3 className="font-semibold">
                        {["Tunde Kelai", "Richard Etim", "Adam Musa"][i % 3]}
                      </h3>
                    </div>
                  </div>
                  <div>
                    {" "}
                    <p className="text-slate-600 text-xl  font-semibold mb-2">
                      Sales Assistant
                    </p>
                    <p className="text-[16px]   text-slate-500">
                      Hardworking and ready to start immediately.
                    </p>
                  </div>
                </div>
                <div className="mt-4  font-extralight flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>2 years experience</span>
                  <span>•</span>
                  <span>Lagos</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="#"
              className="rounded-lg bg-[#1e5b86] px-5 py-3 text-white shadow"
            >
              Post a Job for Free
            </a>
          </div>
        </div>
      </section>

      {/* BENEFIT NUMBERS + IMAGE */}
      <section className="bg-[#1e5b86] text-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <div className="mx-auto mb-8 flex w-[162px] max-w-xs items-center justify-center gap-2 rounded-full bg-white px-2 py-4">
            <span>
              <Image src={tinystar} alt="" />
            </span>
            <span className="text-sm font-semibold text-black">
              Testimonials
            </span>
          </div>
          <div className="mb-10 md:mb-30">
            <h2 className="  text-center text-5xl -tracking-normal my-5">
              Solutions for Your Business
            </h2>
            <p className="mt-1 text-center text-white/70">
              Hire for Any Role, Any Sector
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="order-2 text-center md:order-1 md:text-left md:mr-30 ">
              <div className="flex flex-col justify-center items-center md:mb-30">
                <p className="text-5xl  ">1</p>
                <h3 className="mt-2   tracking-normal  text-[20px]">
                  Verified Candidates
                </h3>
                <p className="text-sm w-full max-w-sm  text-white/80 text-center">
                  ID-checked profiles with references for peace of mind.
                </p>
              </div>
              <div className="mt-10 flex flex-col justify-center items-center ">
                <p className="text-5xl   ">2</p>
                <h3 className="mt-2   text-[20px]">Smart Matching</h3>
                <p className="text-sm w-full max-w-sm  text-white/80 text-center">
                  Algorithm highlights the most qualified applicants for your
                  role.
                </p>
              </div>
            </div>

            <div className="order-1 mx-auto md:order-2">
              <div className="rounded-[2rem] bg-white p-3 relative">
                <div className="">
                  <Image
                    src={solutions}
                    alt="solution hero img"
                    width={500}
                    height={500}
                    className=""
                  />
                </div>
              </div>
            </div>

            <div className="order-3 text-center md:text-left md:ml-30">
              <div className="flex flex-col justify-center items-center md:mb-30">
                <p className="text-5xl   ">3</p>
                <h3 className="mt-2   text-[20px]">
                  All-in-One Dashboard
                </h3>
                <p className="text-sm w-full max-w-sm  text-white/80 text-center">
                  Manage job posts, applications, and messaging from a single
                  platform.
                </p>
              </div>
              <div className="mt-10 flex flex-col justify-center items-center ">
                <p className="text-5xl  ">4</p>
                <h3 className="mt-2   text-[20px]">Cost-Effective</h3>
                <p className="text-sm w-full max-w-sm  text-white/80 text-center">
                  Reach thousands of job seekers with no hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER + FOOTER */}
      <section className="bg-[#20567d]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
          <div className="grid items-center gap-10 rounded-3xl bg-[#346b92]/90 px-5 md:px-25 py-10 md:grid-cols-2">
            <div className="text-white flex flex-col items-center md:items-start ">
              <div className="mb-5 inline-flex items-center gap-2 rounded-3xl bg-white px-3 py-3 text-sm">
                <Image src={tinystar} alt="tiny star" />
                <span className="text-black">Hire Talents</span>
              </div>
              <h3 className="text-5xl  text-center tracking-normal font-dmsans">
                Start Hiring Smarter Today
              </h3>
              <p className="my-8   text-center font-sans text-[14px] font-extralight text-white/80">
                Join thousands of companies saving time and money on
                recruitment.
              </p>
              <div className="mt-6">
                <button
                  className="rounded-lg bg-white px-5 py-3 font-extralight text-[#1e5b86] shadow"
                  onClick={() => handleCTA('/employer/dashboard')}
                >
                  Post Your First Job
                </button>
              </div>
            </div>
            <div className="relative mx-auto max-w-xs">
              <div className="rounded-[2rem] bg-white/10 p-3">
                <Image src={dummyImage} alt="dummy image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// This page is protected by middleware.ts
// No need for client-side protection wrapper
export default EmployerDashboard;
