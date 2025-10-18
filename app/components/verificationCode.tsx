"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Button from "@/app/components/button";
import Carousel from "@/app/components/carousel";

// Optional assets (fallbacks). You can override via props.
import welcome from "@/app/assets/welcomeimage.png";
import welcome2 from "@/app/assets/welcomeimagetwo.png";
import welcome3 from "@/app/assets/securitywithstaff.png";
import logo_second from "@/app/assets/logo_second.svg";

type Props = {
    /** Main title (H1) – make this vary per page */
    heading: string;
    /** Sub message under the title – ReactNode lets you inject spans/links */
    message: React.ReactNode;

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

export default function OtpVerification({
    heading,
    message,
    email,
    onVerify,
    onResend,
    logoSrc = logo_second,
    images = [welcome, welcome2, welcome3],
    otpLength = 6,
    successTitle = "You have successfully verified your mail!",
    onViewDashboard = () => (window.location.href = "/dashboard"),
    onContinueSetup = () => (window.location.href = "/onboarding/profile"),
}: Props) {
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
            // fallback mock
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
                // fallback demo logic to mirror your mock
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
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-white">
            {/* LEFT – form */}
            <div className="flex justify-center px-6 py-10 md:px-12">
                <div className="w-full max-w-xl">
                    {/* Back + Logo */}
                    <div className="mb-8">
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
                            <Image src={logoSrc} alt="logo" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
                            <p className="mt-2 text-xl font-medium text-gray-400">
                                {message ?? (
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
                </div>
            </div>

            {/* RIGHT – carousel + testimonial overlay */}
            <div className="relative order-first h-[280px] md:order-none md:h-auto">
                <Carousel images={images} interval={5000} />

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
                            After being laid off, I was struggling. Within two weeks on this platform, I had three
                            solid interviews. I now work as a Project Manager at a top fintech company. This
                            platform didn’t just give me a job; it gave me a career path.
                        </p>
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-50">
                            <svg width="32" height="32" viewBox="0 0 24 24" className="text-blue-600">
                                <path fill="currentColor" d="M9.55 17.6L4.9 12.95l1.4-1.4l3.25 3.25l7.2-7.2l1.4 1.4z" />
                            </svg>
                        </div>
                        <h2 className="text-center text-lg font-semibold">{successTitle}</h2>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Button variant="secondary" onClick={onViewDashboard} className="w-full">
                                View dashboard
                            </Button>
                            <Button onClick={onContinueSetup} className="w-full">
                                Continue setup
                            </Button>
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
