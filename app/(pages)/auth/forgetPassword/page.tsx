"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "../../components/button";
import Input from "../../components/input";
import logo from "../../assets/coloredlogo.svg";
import { useEffect, useRef, useState, useMemo } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "../../assets/welcomeimage.png";
import welcome2 from "../../assets/welcomeimagetwo.png";
import welcome3 from "../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";

export default function ForgotPassword() {
    const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];
    const [password, setPassword] = useState("");

    const [pwError, setPwError] = useState<string | undefined>(undefined);



    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: replace with real auth logic
        const fakeInvalid = true;
        if (fakeInvalid) setPwError("Incorrect email or password");
    }

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            {/* Left: Form */}
            <div className="flex flex-col justify-center px-8 pl-24 py-5 md:pt-21">
                <div className="mb-8">
                    <Image src={logo} alt="Jobstack logo" width={150} height={40} />
                </div>

                <div className="max-w-xl">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-1 md:pt-18">Welcome Back!</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Great to see you again. Pick up right where you left off.
                    </p>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <Input label="Email Address" placeholder="Enter email address" iconLeft={<Mail size={16} />} />
                        <PasswordField
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (pwError) setPwError(undefined); // clear error as user types
                            }}
                            error={pwError}
                            showHints

                        />
                        <Button className="w-full my-10 text-medium">Create an account</Button>

                        <div className="flex items-center gap-2 mb-10">
                            <hr className="flex-grow border-slate-200" />
                            <span className="text-sm text-slate-500">or</span>
                            <hr className="flex-grow border-slate-200" />
                        </div>
                        <div className="flex">

                            <Button variant="outline" className="w-full">
                                Sign in with Google
                            </Button>
                            <Button variant="outline" className="w-full ml-4">
                                Sign in with Apple
                            </Button>

                        </div>

                        <p className="text-center text-sm text-slate-500">
                            Don’t have an account?{" "}
                            <Link href="/auth/signUp" className="text-blue-600 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right: Carousel */}
            <div className="relative order-first 
             pt-10  md:order-none md:h-full ">
                <div className="relative  h-[300px] mr-5  md:h-[750px]">
                    <Carousel images={IMAGES} interval={5000} />
                </div>
            </div>
            

        </div>
    );
}
