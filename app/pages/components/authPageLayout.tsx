"use client";

import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import logoIcon from "@/app/assets/logo_second.svg";
import logo from "@/app/assets/logoicon.svg";
import Carousel from "@/app/pages/components/carousel";
import welcome from "@/app/assets/welcomeimage.png";
import welcome2 from "@/app/assets/welcomeimagetwo.png";
import welcome3 from "@/app/assets/securitywithstaff.png";
import cooperatewelcome from "@/app/assets/image 505.png"
import cooperatewelcome2 from "@/app/assets/image 506.png"

import Link from "next/link";

export type authPageProps = {
  heading : string;
  subtext?: React.ReactNode;
  message: React.ReactNode;
};

export default function AuthPageLayout({
  heading,
  subtext,
  message,
}: authPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const persona =
    (searchParams.get("persona") as "employer" | "jobseeker") || "jobseeker";

  const jobseekerImgs = [welcome3, welcome, welcome2];
  const employerImgs = [cooperatewelcome, cooperatewelcome2, welcome];

  const carouselImages = persona === "employer" ? employerImgs : jobseekerImgs;
  return (
    <div className="w-full flex flex-col lg:flex-row   p-10  lg:pl-20 relative  overflow-hidden " style={{ fontFamily: 'var(--font-dmSans)' }}>
      {/* Left Column */}
      <div className=" md:px-6 w-full lg:w-[45%] lg:pr-32 flex flex-col " style={{ fontFamily: 'var(--font-dmSans)' }}>
        <div className="hidden my-10 md:flex md:mb-10">
          <Link href="/"><Image src={logoIcon} alt="Page logo " width={200} height={200} /> </Link>
        </div>
        <div className=" md:hidden  flex justify-center ">
          <Link href="/"><Image src={logo} alt="Page logo " width={100} height={20} /> </Link>
        </div>

        <div className="  flex flex-col   justify-center md:justify-start ">
          <div className="flex flex-col justify-center md:justify-start my-8 md:my-2">
            <h1 className="text-3xl     text-slate-900 md:mb-2 text-center md:text-start
                        " >
              {heading}
            </h1>
            <p className="text-center text-gray-600 w-full md:text-start md:mb-8 text-[14px] font-extralight">{subtext}</p>
          </div>
          <div >{message}</div>
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden lg:w-1/2 lg:block order-first   md:order-none ">
        <div className="w-full fixed  h-[300px] md:h-screen">
          <Carousel
            images={carouselImages}
            interval={5000}
            variant="fade"
            className="rounded-3xl md:h-full md:w-[700px]"
          />
        </div>
      </div>
    </div>
  );
}
