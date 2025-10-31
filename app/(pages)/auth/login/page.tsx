"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Button from "@/app/components/button";
import Input from "@/app/components/input";

import logo from "../../../assets/coloredlogo.svg";
import { useState } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "../../../assets/welcomeimage.png";
import welcome2 from "../../../assets/welcomeimagetwo.png";
import welcome3 from "../../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";
import { jsLogin } from "@/app/api/auth-jobseeker.api";
import type { LoginDto } from "@/app/types/auth.type";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
      await jsLogin(payload);
      router.push("/");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Incorrect email or password";
      setPwError(errorMessage);
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
              <Link href="/auth/forgetPassword">Forgot password?</Link>
            </div>
            <Button disabled={submitting} className="w-full my-10 text-medium">
              {submitting ? "Signing in..." : "Sign in"}
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
          {/* Testimonial card (bottom overlay like your mock) */}
          <div className="pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-10">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white/70 p-5 backdrop-blur-md shadow-lg">
              <div className="mb-1 flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-slate-300" />
                <div className="text-sm">
                  <p className="font-medium">Amina B.</p>
                  <p className="text-slate-600">
                    Project Manager at TechFlow NG
                  </p>
                </div>
                <div className="ml-auto text-blue-700">★★★★☆</div>
              </div>
              <p className="text-sm text-slate-700">
                After being laid off, I was struggling. Within two weeks on this
                platform, I had three solid interviews. I now work as a Project
                Manager at a top fintech company. This platform didn’t just give
                me a job; it gave me a career path.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
