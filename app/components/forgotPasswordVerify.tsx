"use client";

import { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/button";
import Carousel from "@/app/components/carousel";
import Image from "next/image";
import welcome from "@/app/assets/welcomeimage.png";
import welcome2 from "@/app/assets/welcomeimagetwo.png";
import welcome3 from "@/app/assets/securitywithstaff.png";
import logo_second from "@/app/assets/logo_second.svg";

export type ForgotPasswordVerifyProps = {
  heading: string;
  message: React.ReactNode;
  email?: string;
  onVerify?: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  successTitle?: string;
  onContinueSetup?: () => void;
  onViewDashboard?: () => void;
};

export default function ForgotPasswordVerify({
  heading,
  message,
  email,
  onVerify,
  onResend,
  successTitle,
  onContinueSetup,
  onViewDashboard,
}: ForgotPasswordVerifyProps) {
  const IMAGES: (StaticImageData | string)[] = [welcome, welcome2, welcome3];

const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const filled = code.every((c) => c !== "");
  const codeString = code.join("");

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setError(null);
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      inputsRef.current[index - 1]?.select();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const arr = Array(6)
      .fill("")
      .map((_, i) => text[i] ?? "");
    setCode(arr);
    setError(null);
    const next = Math.min(text.length, 5);
    inputsRef.current[next]?.focus();
    e.preventDefault();
  };

  const handleResend = async () => {
        if (isResending || timeLeft > 0) return;
        setIsResending(true);
        // If onResend prop provided, call it; else mock
        if (onResend) {
            await onResend();
        } else {
            await new Promise((r) => setTimeout(r, 700));
        }
        setTimeLeft(60);
        setIsResending(false);
  };

  const handleVerify = async () => {
    setError(null);

    if (!filled) {
      setError("Please enter the 6-digit code.");
      return;
    }

    let isValid = false;
    if (onVerify) {
      isValid = await onVerify(codeString);
    } else {
      // mock for demo
      await new Promise((r) => setTimeout(r, 400));
      isValid = codeString === "245012";
    }

    if (isValid) {
      setShowSuccess(true);
    } else {
      setError("That code doesn’t look right. Please try again.");
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-white">
      {/* LEFT – form */}
      <div className="flex items-center justify-center px-6 py-10 md:px-12">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-4">
            <button
              type="button"
              aria-label="Go back"
              className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
              onClick={() => history.back()}
            >
              <span className="inline-block h-5 w-5 rounded-full border border-slate-300 text-center leading-[18px]">
                ‹
              </span>
              Back
            </button>

            <div className="mt-10 mb-20">
              <Image src={logo_second} alt="logo" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {heading}
              </h1>
              <p className="mt-2 text-xl text-gray-400">{message}</p>
            </div>
          </div>

          {/* Code inputs */}
          <div className="flex gap-3">
            {code.map((digit, i) => {
              const base =
                "h-14 w-14 rounded-lg border text-center text-xl font-medium outline-none transition-all";
              const normal =
                "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
              const errored = error ? "border-red-400 ring-2 ring-red-100" : "";
              return (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className={`${base} ${normal} ${errored}`}
                />
              );
            })}
          </div>

                    {/* Helper row */}
                    <div className="mt-4 text-sm text-slate-600">
                        {timeLeft > 0 ? (
                            <div>
                                Resend in <span className="font-medium text-blue-700">0:{String(timeLeft).padStart(2, "0")}</span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Resend code
                            </button>
                        )}
                    </div>

          {/* Error message */}
          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Verify button */}
          <Button
            onClick={handleVerify}
            disabled={!filled}
            className="mt-6 w-full rounded-xl py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            Verify
          </Button>
        </div>
      </div>

      {/* RIGHT – carousel + overlay - Hidden on mobile */}
      <div className="hidden md:block relative md:h-auto">
        <Carousel images={IMAGES} interval={5000} />
        {/* Testimonial card */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-10">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white/70 p-5 backdrop-blur-md shadow-lg">
            <div className="mb-1 flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-slate-300" />
              <div className="text-sm">
                <p className="font-medium">Amina B.</p>
                <p className="text-slate-600">Project Manager at TechFlow NG</p>
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

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-50">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="text-blue-600"
              >
                <path
                  fill="currentColor"
                  d="M9.55 17.6L4.9 12.95l1.4-1.4l3.25 3.25l7.2-7.2l1.4 1.4z"
                />
              </svg>
            </div>
            <h2 className="text-center text-lg font-semibold">
              {successTitle ?? "Verification successful!"}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {onViewDashboard && (
                <Button
                  variant="outline"
                  onClick={onViewDashboard}
                  className="w-full"
                >
                  View dashboard
                </Button>
              )}
              {onContinueSetup && (
                <Button onClick={onContinueSetup} className="w-full">
                  Continue setup
                </Button>
              )}
            </div>

            <button
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => setShowSuccess(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
