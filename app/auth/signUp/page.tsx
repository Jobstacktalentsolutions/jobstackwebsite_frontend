"use client";

import Link from "next/link";
import AuthPageLayout from "@/app/components/authPageLayout";
import { Mail, User2, Phone, Building2 } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import google from "../../assets/google.svg";
import apple from "../../assets/apple.svg";
import PasswordField from "@/app/components/passwordField";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/api/client";
import Image from "next/image";

// Password rule from your spec: >=8, 1 upper, 1 lower, 1 number
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
// E.164 per spec (optional +, nonzero start, up to 15 digits total)
const e164 = /^\+?[1-9]\d{1,14}$/;

// Convert common NG local like 0806... -> +234806...
function normalizePhone(raw: string) {
    const v = raw.replace(/\s+/g, "");
    if (v.startsWith("+")) return v;
    if (/^0\d{10}$/.test(v)) return `+234${v.slice(1)}`;
    return v;
}

type Persona = "jobseeker" | "employer";

export default function SignUp() {
    const searchParams = useSearchParams();
    const persona: Persona = (searchParams.get("persona") as Persona) || "jobseeker";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState<string | undefined>();
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Jobseeker fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Employer fields
    const [name, setName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [businessType, setBusinessType] = useState<"company" | "individual">("company");
    const [employerPhone, setEmployerPhone] = useState("");

    const router = useRouter();

    const { heading, subtext } = useMemo(() => {
        if (persona === "employer") {
            return {
                heading: "Start hiring today",
                subtext: "Create your employer account to post roles and manage applicants in minutes.",
            };
        }
        return {
            heading: "Start your journey",
            subtext: "Create your free account in just a minute. Your dream role is closer than you think.",
        };
    }, [persona]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setErr(null);
        setPwError(undefined);

        if (!passwordRule.test(password)) {
            setPwError("Password must be 8+ characters with 1 uppercase, 1 lowercase, and 1 number.");
            return;
        }
        if (password !== confirmPassword) {
            setPwError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            if (persona === "jobseeker") {
                const fn = firstName.trim();
                const ln = lastName.trim();
                const em = email.trim();
                const pn = normalizePhone(phoneNumber.trim());

                if (fn.length < 2 || ln.length < 2) {
                    setErr("First and last name must be at least 2 characters.");
                    return;
                }
                if (!e164.test(pn)) {
                    setErr("Enter a valid phone number in E.164 format, e.g. +2348063008035.");
                    return;
                }

                const payload = {
                    role: "jobseeker",
                    email: em,
                    password,
                    firstName: fn,
                    lastName: ln,
                    phoneNumber: pn,
                };

                await api.register(payload);
                await api.sendVerification(em);
                router.push(`/auth/signUp/verify?email=${encodeURIComponent(em)}`);
            } else {
                const nm = name.trim();
                const cem = companyEmail.trim();
                const pn = employerPhone ? normalizePhone(employerPhone.trim()) : undefined;

                if (nm.length < 2) {
                    setErr("Name must be at least 2 characters.");
                    return;
                }
                if (pn && !e164.test(pn)) {
                    setErr("Enter a valid phone number in E.164 format, e.g. +2348063008035.");
                    return;
                }

                const payload = {
                    role: "employer",
                    name: nm,
                    companyEmail: cem,
                    businessType,
                    phoneNumber: pn,
                    password,
                };

                await (api.registerEmployer
                    ? api.registerEmployer(payload)
                    : api.register(payload));

                await api.sendVerification(cem);
                router.push(`/auth/signUp/verify?email=${encodeURIComponent(cem)}`);
            }
        } catch (e: any) {
            setErr(e?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageLayout
            heading={heading}
            subtext={subtext}
            message={
                <form className="space-y-4" onSubmit={onSubmit}>
                    {persona === "jobseeker" ? (
                        <>
                            <Input
                                label="Firstname:"
                                placeholder="Enter your first name"
                                iconLeft={<User2 size={16} />}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                label="Lastname:"
                                placeholder="Enter your last name"
                                iconLeft={<User2 size={16} />}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Input
                                label="Email Address"
                                placeholder="Enter email address"
                                iconLeft={<Mail size={16} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="e.g., +2348063008035"
                                iconLeft={<Phone size={16} />}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </>
                    ) : (
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
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value="company"
                                            checked={businessType === "company"}
                                            onChange={() => setBusinessType("company")}
                                        />
                                        <span className="inline-flex items-center gap-1">
                                            <Building2 size={16} /> Company
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="businessType"
                                            value="individual"
                                            checked={businessType === "individual"}
                                            onChange={() => setBusinessType("individual")}
                                        />
                                        <span>Individual business</span>
                                    </label>
                                </div>
                            </div>
                            <Input
                                label="Phone Number (optional)"
                                placeholder="e.g., +2348063008035"
                                iconLeft={<Phone size={16} />}
                                value={employerPhone}
                                onChange={(e) => setEmployerPhone(e.target.value)}
                            />
                        </>
                    )}

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
                        {loading
                            ? "Creating account..."
                            : persona === "employer"
                                ? "Create employer account"
                                : "Create an account"}
                    </Button>

                    {err && <p className="text-red-600 text-sm whitespace-pre-line">{err}</p>}

                    <div className="flex items-center gap-2 mb-10">
                        <hr className="flex-grow border-slate-200" />
                        <span className="text-sm text-slate-500">or</span>
                        <hr className="flex-grow border-slate-200" />
                    </div>

                    <div className="flex w-full justify-center">
                        <button
                            type="button"
                            className="flex mx-4 justify-center p-2 rounded-lg border-gray-500 border-[1px]"
                        >
                            <Image src={google} alt="google icon" />
                        </button>
                        <button
                            type="button"
                            className="flex justify-center border-gray-500 p-2 rounded-lg border-[1px]"
                        >
                            <Image src={apple} alt="apple icon" />
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
    );
}
