"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import logo from "../assets/coloredlogo.svg";
import Carousel from "@/app/components/carousel";
import welcome from "../assets/welcomeimage.png";
import welcome2 from "../assets/welcomeimagetwo.png";
import welcome3 from "../assets/securitywithstaff.png";
import Link from "next/link";

export type authPageProps = {
  heading: string;
  subtext: string;
  message: React.ReactNode;
};

export default function ForgotPassword({
  heading,
  subtext,
  message,
}: authPageProps) {
  const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row w-full">
      {/* Left Column */}
      <div className="px-6 md:px-12 lg:px-24 flex flex-col justify-center w-full md:w-1/2 py-8">
        <div className="max-w-xl mx-auto w-full">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="mb-10">
            <Link href="/">
              <Image src={logo} alt="Page logo " width={150} height={40} />{" "}
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              {heading}
            </h1>
            <p className="text-gray-400 mb-8 text-base">{subtext}</p>
            <div>{message}</div>
          </div>
        </div>
      </div>

      {/* Right Column - Hidden on mobile */}
      <div className="hidden md:block relative w-1/2 bg-white px-10 overflow-hidden">
        <div className="w-full h-[700px]">
          <Carousel images={IMAGES} interval={5000} />
        </div>
      </div>
    </div>
  );
}
