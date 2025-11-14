"use client";

import AuthPageLayout from "@/app/pages/components/authPageLayout";
import {
  jsVerifyEmail,
  jsSendVerificationEmail,
} from "@/app/api/auth-jobseeker.api";
import { toastSuccess, toastError, toastInfo } from "@/app/lib/toast";
import { setAuthTokens } from "@/app/lib/cookies";
import Button from "@/app/pages/components/button";
import { useEffect, useRef, useState } from "react";
import TimeSlot from "@/app/pages/components/timeLeft";

interface Props {
  heading: string;
  email: string;
}

export default function VerifyClient({ heading, email }: Props) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Send verification code on first render
  useEffect(() => {
    const sendInitialCode = async () => {
      try {
        await jsSendVerificationEmail({ email });
        toastInfo("Verification code sent to your email");
      } catch (e) {
        // Silently fail on initial send - user can resend if needed
        console.error("Failed to send initial verification code:", e);
      }
    };
    sendInitialCode();
  }, [email]);

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

  const handleVerify = async () => {
    if (isVerified || isVerifying) return;

    try {
      setError(null);
      setIsVerifying(true);
      const authResult = await jsVerifyEmail({ email, code: codeString });

      // Store tokens in cookies before redirecting
      setAuthTokens(
        authResult.accessToken,
        authResult.refreshToken,
        authResult.user.role
      );

      setIsVerified(true);
      toastSuccess("Email verified successfully");

      // Small delay to show success state, then redirect
      setTimeout(() => {
        window.location.href = "/pages/jobseeker/auth/profile";
      }, 500);
    } catch (e) {
      setError("Invalid or expired code.");
      toastError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isVerified) return;

    try {
      setIsResending(true);
      setError(null);
      await jsSendVerificationEmail({ email });
      toastInfo("Verification email resent");
      setTimeLeft(60); // restart timer
    } catch (e) {
      toastError("Failed to resend verification.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthPageLayout
      heading={heading}
      subtext={
        <p>
          We sent a 6-digit code to ${email}. <br />
          Please enter it below to continue.
        </p>
      }
      message={
        <>
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
              <div>Didn&apos;t receive code? Resend in </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend code"}
              </button>
            )}
          </div>
          <div className="my-10 flex justify-center">
            <TimeSlot timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
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
            disabled={!filled || isVerified || isVerifying}
            className="mt-6 w-full rounded-xl py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying
              ? "Verifying..."
              : isVerified
              ? "Verified ✓"
              : "Verify"}
          </Button>
        </>
      }
    />
  );
}
