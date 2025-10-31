"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import logo from "@/app/assets/coloredlogo.svg";
import { useState } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "@/app/assets/welcomeimage.png";
import welcome2 from "@/app/assets/welcomeimagetwo.png";
import welcome3 from "@/app/assets/securitywithstaff.png";
import { jsSendPasswordResetCode } from "@/app/api/auth-jobseeker.api";
import { toastError, toastSuccess } from "@/app/lib/toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSubmitting(true);
    try {
      await jsSendPasswordResetCode({ email });
      toastSuccess("Reset code sent to your email");
      router.push(
        `/auth/forgetPassword/verify?email=${encodeURIComponent(email)}`
      );
    } catch {
      setError("Failed to send reset code");
      toastError("Failed to send reset code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 py-8">
        <div className="mb-8">
          <Image src={logo} alt="Jobstack logo" width={150} height={40} />
        </div>

        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-slate-900 mb-1 md:pt-18">
            Welcome Back!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Great to see you again. Pick up right where you left off.
          </p>

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
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button disabled={submitting} className="w-full my-10 text-medium">
              {submitting ? "Sending..." : "Send reset code"}
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
              Don’t have an account?{" "}
              <Link
                href="/auth/signUp"
                className="text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Carousel - Hidden on mobile */}
      <div className="hidden md:block relative md:h-full">
        <div className="relative h-[750px]">
          <Carousel images={IMAGES} interval={5000} />
        </div>
      </div>
    </div>
  );
}
