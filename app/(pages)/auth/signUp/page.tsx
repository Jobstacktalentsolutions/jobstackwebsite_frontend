"use client";

import Link from "next/link";
import AuthPageLayout from "@/app/components/authPageLayout";
import { Mail, User2, Phone } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useState } from "react";
import PasswordField from "@/app/components/passwordField";
import { jsRegister } from "@/app/api/auth-jobseeker.api";
import { toastSuccess, toastError } from "@/app/lib/toast";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

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
phoneNumber: phone,
      };
      const res = await jsRegister(payload);
      toastSuccess("Verification code sent to your email");
      router.push(`/auth/signUp/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
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
          <>
            <form className=" space-y-4" onSubmit={onSubmit}>
              <Input
                label="Fullname"
                placeholder="Enter your fullname"
                iconLeft={<User2 size={16} />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                placeholder="Enter email address"
                iconLeft={<Mail size={16} />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                iconLeft={<Phone size={16} />}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <PasswordField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (pwError) setPwError(undefined); // clear error as user types
                }}
                error={pwError}
              />
              <Button
                disabled={submitting}
                className="w-full my-10 text-medium"
              >
                {submitting ? "Creating..." : "Create an account"}
              </Button>

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
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </>
        }
      />
    </div>
  );
}
