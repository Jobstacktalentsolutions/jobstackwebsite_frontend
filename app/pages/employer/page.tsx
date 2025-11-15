"use client";
import React from 'react'
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
import Nav from "@/app/pages/components/employerNav"
import hero from "@/app/assets/employersheroimg.svg";
import dummyImage from "@/app/assets/dummyImage.png";
import { Hospital } from "lucide-react";
import Link from "next/link";
import Footer from "@/app/pages/components/footer";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

function EmployerDashboard() {
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
    <main className="min-h-screen font-sans text-slate-900 [font-family:Inter,system-ui]">
      {/* NAV */}
      <Nav />

      {/* HERO */}
      <section className="bg-[#1e5b86] ">
        <div className="mx-auto  max-w-9xl px-6 md:px-10 py-20 md:py-30">
          <div className="flex items-center justify-between gap-10 my-10 mx-20 md:">
            <div className="text-white">
              <h1 className="text-5xl max-w-7xl font-medium leading-tight md:text-6xl">
                Hire Quality Talent, <br /> Fast.
              </h1>
              <p className="mt-4  text-white/80 font-light">
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
          <div className="mb-30">
            <h2 className="  text-center text-5xl -tracking-normal my-5">
              Solutions for Your Business
            </h2>
            <p className="mt-1 text-center text-white/70">
              Hire for Any Role, Any Sector
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="order-2 text-center md:order-1 md:text-left mr-30 ">
              <div className="flex flex-col justify-center items-center mb-30">
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

            <div className="order-3 text-center md:text-left ml-30">
              <div className="flex flex-col justify-center items-center mb-30">
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
          <div className="grid items-center gap-10 rounded-3xl bg-[#346b92]/90 px-25 py-10 md:grid-cols-2">
            <div className="text-white ">
              <div className="mb-5 inline-flex items-center gap-2 rounded-3xl bg-white px-3 py-3 text-sm">
                <Image src={tinystar} alt="tiny star" />
                <span className="text-black">Hire Talents</span>
              </div>
              <h3 className="text-5xl   tracking-normal font-dmsans">
                Start Hiring Smarter Today
              </h3>
              <p className="my-8  font-sans text-[14px] font-extralight text-white/80">
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
