"use client";

import Link from "next/link";
import AuthPageLayout from "@/app/components/authPageLayout";
import { Mail, User2, Phone, Building2 } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useMemo, useState } from "react";
import PasswordField from "@/app/components/passwordField";
import { jsRegister } from "@/app/api/auth-jobseeker.api";
import { toastSuccess, toastError } from "@/app/lib/toast";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";
import { useRouter, useSearchParams } from "next/navigation";

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
  // Jobseeker fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");



  // Employer fields
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [businessType, setBusinessType] = useState<"company" | "individual">("company");


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
        phoneNumber: phoneNumber ,
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
        heading="Start your journey"
        subtext="Create your free account in just a minute. Your dream role is closer than you think."
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
              {loading ? "Creating account..." : persona === "employer" ? "Create employer account" : "Create an account"}
            </Button>

            {err && <p className="text-red-600 text-sm whitespace-pre-line">{err}</p>}

            <div className="flex items-center gap-2 mb-10">
              <hr className="flex-grow border-slate-200" />
              <span className="text-sm text-slate-500">or</span>
              <hr className="flex-grow border-slate-200" />
            </div>

            <div className="flex w-full justify-center">
              <button type="button" className="flex mx-4 justify-center p-2 rounded-lg border-gray-500 border-[1px]">Google
                {/* <Image src={google} alt="google icon" /> */}
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
