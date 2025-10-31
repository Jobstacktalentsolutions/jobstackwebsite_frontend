"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import AuthPageLayout from "@/app/components/authPageLayout";
import { Mail, User2 } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { useState } from "react";
import welcome from "../../../assets/welcomeimage.png";
import welcome2 from "../../../assets/welcomeimagetwo.png";
import welcome3 from "../../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";
import { jsRegister } from "@/app/api/auth-jobseeker.api";
import type { JobSeekerRegistrationDto } from "@/app/types/jobseeker.type";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
        phoneNumber: "08000000000", // TODO: collect real phone
      };
      await jsRegister(payload);
      router.push("/auth/signUp/verify");
    } catch (err: any) {
      setPwError("Unable to create account");
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
