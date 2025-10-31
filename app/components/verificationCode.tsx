"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type StaticImageData } from "next/image";
import Button from "@/app/components/button";
import SuccessModal from "@/app/components/sucessModal";
import AuthPageLayout from '@/app/components/authPageLayout';
type Props = {
    /** Main title (H1) – make this vary per page */
    heading: string;
    /** Sub message under the title – ReactNode lets you inject spans/links */
    text: React.ReactNode;

    /** Email to display (optional if you already put it inside message) */
    email?: string;

    /** Callback to verify the code. Return true to show success modal, false to show error */
    onVerify?: (code: string) => Promise<boolean> | boolean;

    /** Optional resend handler (if omitted, a mock runs) */
    onResend?: () => Promise<void> | void;

    /** Optional logo source (defaults to your svg) */
    logoSrc?: StaticImageData | string;

    /** Images for the right-hand carousel */
    images?: (StaticImageData | string)[];

    /** OTP length (default 6) */
    otpLength?: number;

    /** Custom success title (modal) */
    successTitle?: string;

    /** CTA handlers in the success modal */
    onViewDashboard?: () => void;
    onContinueSetup?: () => void;
};

export default function OtpVerification(
    {
    heading,
    text,
    email,
    onVerify,
    onResend,
  
    otpLength = 6,
    successTitle = "You have successfully verified your mail!",
    onViewDashboard = () => (window.location.href = "/dashboard"),
    onContinueSetup = () => (window.location.href = "/onboarding/profile"),
}: Props) {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleSuccess = () => {
        setShowModal(true);
    };

    const handleLoginRedirect = () => {
        router.push("/auth/login?next=/dashboard");
    }
    const [code, setCode] = useState<string[]>(Array(otpLength).fill(""));
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    // countdown
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

        if (value && index < otpLength - 1) {
            inputsRef.current[index + 1]?.focus();
            inputsRef.current[index + 1]?.select();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
            inputsRef.current[index - 1]?.select();
        }
        if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < otpLength - 1) inputsRef.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
        if (!text) return;
        const arr = Array(otpLength)
            .fill("")
            .map((_, i) => text[i] ?? "");
        setCode(arr);
        setError(null);
        inputsRef.current[Math.min(text.length, otpLength - 1)]?.focus();
        e.preventDefault();
    };

    const handleResend = async () => {
        if (isResending || timeLeft > 0) return;
        setIsResending(true);
        try {
            if (onResend) await onResend();
            //  fallback mock
            if (!onResend) await new Promise((r) => setTimeout(r, 600));
            setTimeLeft(60);
        } finally {
            setIsResending(false);
        }
    };

    const handleVerify = async () => {
        setError(null);
        if (!filled) {
            setError("Please enter the 6-digit code.");
            return;
        }

        try {
            let ok = false;
            if (onVerify) {
                ok = await onVerify(codeString);
            } else {
                //  fallback demo logic to mirror your mock
                await new Promise((r) => setTimeout(r, 400));
                ok = codeString === "245012";
            }
            if (ok) setShowSuccess(true);
            else {
                setError("That code doesn’t look right. Please try again.");
                inputsRef.current[0]?.focus();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (

        <AuthPageLayout heading={heading}
            message={
                <>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
                        <p className="mt-2 text-xl font-medium text-gray-400">
                            {text ?? (
                                <>
                                    We sent a 6-digit verification code
                                    {email ? (
                                        <>
                                            {" "}
                                            to <span className="text-blue-600">{email}</span>. Please enter it below to
                                            continue.
                                        </>
                                    ) : (
                                        ". Please enter it below to continue."
                                    )}
                                </>
                            )}
                        </p>
                    </div>


                    {/* Inputs */}
                    <div className="flex gap-3">
                        {code.map((digit, i) => {
                            const base =
                                "h-14 w-14 rounded-lg border text-center text-xl font-medium outline-none transition-all";
                            const normal = "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
                            const errored = error ? "border-red-400 ring-2 ring-red-100" : "";
                            return (
                                <input
                                    key={i}
                                    ref={(el) => (inputsRef.current[i] = el)}
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
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="text-gray-400">
                            Didn’t receive your code?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timeLeft > 0 || isResending}
                                className="font-medium text-blue-400 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Resend
                            </button>
                        </div>
                        <div className="text-slate-600">
                            Expires in <span className="font-medium text-blue-700">0:{String(timeLeft).padStart(2, "0")}</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="mt-3 text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    {/* Verify */}
                    <Button
                        onClick={handleVerify}
                        disabled={!filled}
                        className="mt-6 w-full rounded-xl py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Verify
                    </Button>





                    {/* SUCCESS MODAL */}
                    {showSuccess && (
                        <SuccessModal open={showModal}
                            onClose={() => setShowModal(false)}
                            message="Account created successfully! Please log in to continue."
                            onLogin={handleLoginRedirect} />
                    )}
                </>

            }
        />

    );

}
