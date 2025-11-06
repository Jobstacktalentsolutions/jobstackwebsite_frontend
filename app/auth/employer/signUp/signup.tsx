"use client";

import Link from "next/link";
import AuthPageLayout from "@/app/components/AuthPageLayout";
import { Mail, User2, Phone, Building2 } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useMemo, useState } from "react";
import Image from "next/image";
import PasswordField from "@/app/components/passwordField";
import { jsRegister } from "@/app/api/auth-jobseeker.api";
import { toastSuccess, toastError } from "@/app/lib/toast";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";
import { useRouter, useSearchParams } from "next/navigation";
import googleIcon from '@/app/assets/google.svg'

export default function SignUp() {

    const [fullName, setfullName] = useState('')
    const [submitting, setSubmitting] = useState(false);
    type Persona = "jobseeker" | "employer";

    const searchParams = useSearchParams();
    const persona: Persona = (searchParams.get("persona") as Persona) || "jobseeker";

    // Shared
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState<string | undefined>();
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    // Employer fields
    const [name, setName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [businessType, setBusinessType] = useState<"Company" | "Individual" | "Small business">("Company");


    const router = useRouter();



    async function onSubmit(e: React.FormEvent) {

        e.preventDefault();
        setPwError(undefined);
        setSubmitting(true);
        try {
            const [firstName, ...rest] = fullName.trim().split(" ");
            const lastName = rest.join(" ") || firstName;
            const payload: JobSeekerRegistrationDto = {
                email,
                password,
                firstName,
                lastName,
                phoneNumber: phoneNumber,
            };
            const res = await jsRegister(payload);
            toastSuccess("Verification code sent to your email");
            router.push(`/auth/employer/signUp/verify?email=${encodeURIComponent(email)}`);
        } catch (err: unknown) {
            const errorMessage =
                err?.response?.data?.message || "Unable to create account";
            setPwError(errorMessage);
            toastError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="">
            <AuthPageLayout
                heading="Start Hiring Today "
                subtext="Create your free account in just a minute. Your dream role is closer than you think."
                message={
                    <form className="space-y-4" onSubmit={onSubmit}>

                        <>
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                iconLeft={<User2 size={16} />}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                label="Company Email"
                                placeholder="name@company.com"
                                iconLeft={<Mail size={16} />}
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                            />
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Account Type
                                </label>
                                <div className="flex flex-col w-full font-light text-gray-500 gap-4 ">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value="company"
                                            checked={businessType === "Company"}
                                            onChange={() => setBusinessType("Company")}
                                        />
                                        <span className="inline-flex items-center gap-1">
                                            Company
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value="individual"
                                            checked={businessType === "Small business"}
                                            onChange={() => setBusinessType("Individual")}
                                        />
                                        <span>Individual business</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value="individual"
                                            checked={businessType === "Small business"}
                                            onChange={() => setBusinessType("Small business")}
                                        />
                                        <span>Small business</span>
                                    </label>
                                </div>
                            </div>
                            <Input
                                label="Phone Number (optional)"
                                placeholder="e.g., +2348063008035"
                                iconLeft={<Phone size={16} />}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </>


                        <PasswordField
                            label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (pwError) setPwError(undefined);
                            }}
                            error={pwError}
                        />
                        <PasswordField
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (pwError) setPwError(undefined);
                            }}
                            error={pwError}
                        />

                        <Button className="w-full my-10 text-medium" disabled={loading}>
                            {loading ? "Creating account..." : persona === "employer" ? "Create employer account" : "Create an account"}
                        </Button>

                        {err && <p className="text-red-600 text-sm whitespace-pre-line">{err}</p>}

                        <div className="flex items-center gap-2 mb-10">
                            <hr className="flex-grow border-slate-200" />
                            <span className="text-sm text-slate-500">or</span>
                            <hr className="flex-grow border-slate-200" />
                        </div>

                        <div className="flex w-full justify-center">
                            <button type="button" className="flex mx-4 px-5 justify-center p-2 rounded-lg border-gray-500 border-[1px]">   <Image src={googleIcon} alt="google icon" className="mx-4" /> Sign up with Google


                            </button>

                        </div>

                        <p className="text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>

                }
            />
        </div>
    )
}
