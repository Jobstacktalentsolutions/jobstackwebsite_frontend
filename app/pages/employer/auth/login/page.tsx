"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import Button from "@/app/pages/components/button";
import Input from "@/app/pages/components/input";
import AuthPageLayout from "@/app/pages/components/authPageLayout";
import GoogleSignInButton from "@/app/pages/components/GoogleSignInButton";

import { useState } from "react";

import PasswordField from "@/app/pages/components/passwordField";
import { empSendVerificationEmail } from "@/app/api/auth-employer.api";
import { toastError, toastSuccess, toastInfo } from "@/app/lib/toast";
import type { LoginDto } from "@/app/types/auth.type";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/app/hooks/useAuthActions";

export default function LoginPage() {
  const router = useRouter();
  const { loginEmployer } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError(undefined);
    setSubmitting(true);
    try {
      const payload: LoginDto = { email: email.toLowerCase(), password };
      await loginEmployer(payload);
      toastSuccess("Signed in successfully");
      // Redirect is handled by auth context login function
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message || "Incorrect email or password";

      if (/verify\s+your\s+email/i.test(errorMessage)) {
        try {
          await empSendVerificationEmail({ email });
        } catch {}
        toastInfo("Please verify your email to continue");
        router.push(
          ` /pages/employer/auth/login/verify?email=${encodeURIComponent(
            email
          )}`
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
      heading="Welcome back!"
      subtext="Great to see you again. Pick up right where you left off."
      message={
        <div className="flex flex-col justify-center py-2">
          <div className="w-full">
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
              <div className="flex justify-end">
                <Link
                  href="/pages/employer/auth/forgetPassword"
                  className="text-[12px] text-slate-600 font-extralight"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                disabled={submitting}
                className="w-full my-10 text-medium"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex items-center gap-2 mb-10">
                <hr className="flex-grow border-slate-200" />
                <span className="text-sm text-slate-500">or</span>
                <hr className="flex-grow border-slate-200" />
              </div>
              <GoogleSignInButton className="w-full" />

              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/pages/employer/auth/signUp"
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
