"use client";

import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import logoIcon from "../assets/logo_second.svg";
import logo from "../assets/logoicon.svg";
import Carousel from "@/app/components/carousel";
import welcome from "../assets/welcomeimage.png";
import welcome2 from "../assets/welcomeimagetwo.png";
import welcome3 from "../assets/securitywithstaff.png";
import Link from "next/link";

export type authPageProps = {
  heading: string;
  subtext?: React.ReactNode;
  message: React.ReactNode;
};

export default function ForgotPassword({
  heading,
  subtext,
  message,
}: authPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const persona =
    (searchParams.get("persona") as "employer" | "jobseeker") || "jobseeker";

  const employerImgs = [welcome3, welcome, welcome2];
  const jobseekerImgs = [welcome, welcome2, welcome3];

  const carouselImages = persona === "employer" ? employerImgs : jobseekerImgs;
    return (
      <div className="w-full flex flex-col md:flex-row   p-10 md:my-10 md:pl-20 relative  overflow-hidden " style={{ fontFamily: 'var(--font-dmSans)' }}>
            {/* Left Column */}
        <div className=" md:px-6 w-full md:w-[45%] md:pr-32 flex flex-col " style={{ fontFamily: 'var(--font-dmSans)' }}>
          <div className="hidden my-10 md:flex md:mb-21">
            <Link href="/"><Image src={logoIcon} alt="Page logo " width={200} height={200} /> </Link>
              </div>
          <div className=" md:hidden  flex justify-center ">
                    <Link href="/"><Image src={logo} alt="Page logo " width={100} height={20}/> </Link>
                </div>

          <div className="  flex flex-col   justify-center md:justify-start ">
                    <div className="flex flex-col justify-center md:justify-start my-8 md:my-2">
                        <h1 className="text-3xl font-light   text-slate-900 md:mb-2 text-center md:text-start
                        " >
                            {heading}
                        </h1>
                        <p className="text-center text-gray-600  w-2xs md:text-start md:mb-8 text-[14px] font-extralight">{subtext}</p>
                   </div>
                    <div >{message}</div>
                </div>
            </div>

      {/* Right Column */}
      <div className="hidden md:w-1/2 md:block order-first   md:order-none bg-white">
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
