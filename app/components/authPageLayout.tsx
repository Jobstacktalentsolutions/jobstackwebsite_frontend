"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import logo from "../assets/coloredlogo.svg";
import Carousel from "@/app/components/carousel";
import welcome from "../assets/welcomeimage.png";
import welcome2 from "../assets/welcomeimagetwo.png";
import welcome3 from "../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";
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
        <div className="flex min-h-screen flex-col md:flex-row w-full my-10 ">
            {/* Left Column */}
            <div className="px-12   flex flex-col w-1/2">
                <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-20"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="mb-10">
                    <Link href="/"><Image src={logo} alt="Page logo " width={150} height={40}/> </Link>
                </div>

                <div className="max-w-xl">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                        {heading}
                    </h1>
                    <p className="text-gray-400 mb-8 text-base">{subtext}</p>
                    <div>{message}</div>
                </div>
            </div>

            {/* Right Column */}
            <div className="hidden md:block relative order-first   w-1/2 md:order-none bg-white px-10 overflow-hidden">
                <div className="w-full h-[300px] md:h-[700px]">
                    <Carousel images={IMAGES} interval={5000} />
                </div>
            </div>
        </div>
    );
}
