"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import AuthPageLayout from "../../components/authPageLayout";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User2 } from "lucide-react";
import Button from "../../components/button";
import Input from "../../components/input";
import logo from "../../assets/coloredlogo.svg";
import { useEffect, useRef, useState, useMemo } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "../../assets/welcomeimage.png";
import welcome2 from "../../assets/welcomeimagetwo.png";
import welcome3 from "../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";

export default function SignUp() {
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
        <div className="">
         
            <AuthPageLayout heading="Start your journey"
                subtext="Create your free account in just a minute. Your dream role is closer than you think."
                message={
                <>
                                <form className=" space-y-4" onSubmit={onSubmit}>
                                    <Input label="Fullname" placeholder="Enter your fullname" iconLeft={<User2 size={16} />} />
                                    <Input label="Email Address" placeholder="Enter email address" iconLeft={<Mail size={16} />} />
                                    <PasswordField
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (pwError) setPwError(undefined); // clear error as user types
                                        }}
                                        error={pwError}
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
                                        Already have an account?{" "}
                                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </form>
                        
                </>
            }/>
        </div>
    );
}
