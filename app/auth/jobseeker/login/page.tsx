"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import AuthPageLayout from "@/app/components/AuthPageLayout";
import logo from "../../../assets/coloredlogo.svg";
import { useState } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "../../../assets/welcomeimage.png";
import welcome2 from "../../../assets/welcomeimagetwo.png";
import welcome3 from "../../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";
import { jsSendVerificationEmail } from "@/app/api/auth-jobseeker.api";
import { toastError, toastSuccess, toastInfo } from "@/app/lib/toast";
import type { LoginDto } from "@/app/types/auth.type";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/app/hooks/useAuthActions";

export default function LoginPage() {
  const router = useRouter();
  const { loginJobSeeker } = useAuthActions();
  const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError(undefined);
    setSubmitting(true);
    try {
      const payload: LoginDto = { email, password };
      await loginJobSeeker(payload);
      toastSuccess("Signed in successfully");
      // Redirect is handled by auth context login function
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message || "Incorrect email or password";

      if (/verify\s+your\s+email/i.test(errorMessage)) {
        try {
          await jsSendVerificationEmail({ email });
        } catch {}
        toastInfo("Please verify your email to continue");
        router.push(
          `/auth/employer/signUp/verify?email=${encodeURIComponent(email)}`
        );
        return;
      }

      setPwError(errorMessage);
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageLayout
      heading=" Welcome Back!"
      subtext=" Great to see you again. Pick up right where you left off."
      message={
        <div className="flex flex-col justify-center  ">
          <div className="max-w-xl mx-auto w-full">
            <form className="space-y-4" onSubmit={onSubmit}>
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
                  if (pwError) setPwError(undefined);
                }}
                error={pwError}
                showHints={false}
              />
              <div className=" flex justify-end">
                <Link href="/auth/jobseeker/forgetPassword">
                  Forgot password?
                </Link>
              </div>
              <Button disabled={submitting} className="w-full my-8 text-medium">
                {submitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex items-center gap-2 mb-6">
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
                <Link
                  href="/auth/jobseeker/signUp"
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      }
    />
  );
}
