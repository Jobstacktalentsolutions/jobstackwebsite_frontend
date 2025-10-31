"use client";

import { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/button";
import Carousel from "@/app/components/carousel";
import Image from "next/image";
import AuthPageLayout from "../components/authPageLayout";
import logo_second from "@/app/assets/logo_second.svg";

export type ForgotPasswordVerifyProps = {
    heading: string;
    message: React.ReactNode | string;
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
        const text = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
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
        <AuthPageLayout heading={heading} subtext={message} message={
            <div className="flex flex-col justify-center px-6  md:px-12">



                {/* Code inputs */}
                <div className="flex gap-3 w-full relative">
                    {code.map((digit, i) => {
                        const base =
                            "h-12 w-12 md:w-12 md:h-14 rounded-lg border text-center text-xl font-medium outline-none transition-all";
                        const normal =
                            "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
                        const errored = error ? "border-red-400 ring-2 ring-red-100" : "";
                        const bg = digit ? "bg-white" : "bg-gray-300 focus:bg-white";

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
                                placeholder=""
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={handlePaste}
                                className={`${base} ${normal} ${errored} ${bg}`}
                            />
                        );
                    })}
                </div>



                {/* Helper row */}
                <div className="mt-4 flex flex-col justify-between gap-3 text-sm text-slate-600">
                    <div className="text-gray-400 text-sm">
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
                    <div className="flex justify-center my-3">
                        <p className="inline-block mr-2">Expires in&nbsp;</p>
                        <span className="font-medium text-blue-700">
                            0:{String(timeLeft).padStart(2, "0")}
                        </span>
                    </div>
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
                    className={`mt-6 w-full rounded-xl py-4 text-base transition-colors duration-200 ${filled
                        ? "bg-[#2572A7] text-white"
                        : "bg-[#2572A7]/60 text-white cursor-not-allowed"
                        }`}
                >
                    Verify
                </Button>

            </div>


        } />
    );
}  // <-- end component
