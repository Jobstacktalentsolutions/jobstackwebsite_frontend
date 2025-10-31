"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/api/client";
import OtpVerification from "@/app/components/verificationCode";

<<<<<<< HEAD:app/auth/signUp/verify/page.tsx
export default function VerifyEmailPage() {
    const router = useRouter();
    const sp = useSearchParams();
    const initialEmail = sp.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [err, setErr] = useState<string>("");

    const getErrorMessage = (e: unknown) =>
        e instanceof Error ? e.message : "Something went wrong";

    // Called by OtpVerification when user submits the 6-digit code
    const onVerify = async (code: string): Promise<boolean> => {
        setErr("");
        setLoading(true);
        try {
            await api.verifyEmail(email, code);
            router.push("/success");
            return true; // ✅ Indicate success
        } catch (e: unknown) {
            setErr(getErrorMessage(e));
            return false; // ✅ Indicate failure
        } finally {
            setLoading(false);
        }
    };

    // Called by OtpVerification when user taps "Resend code"
    const resend = async () => {
        setErr("");
        setResending(true);
        try {
            await api.sendVerification(email);
            // You can swap this alert for a toast in your UI system
            alert("Verification code resent.");
        } catch (e: unknown) {
            setErr(getErrorMessage(e) || "Failed to resend code");
        } finally {
            setResending(false);
        }
    };
=======
export default function VerifyEmailPage({ searchParams }: { searchParams: { email?: string } }) {
    const email = searchParams.email ?? "";
>>>>>>> 5510026d33b37d0b53a5e176b7791a380e43c674:app/(pages)/auth/signUp/verify/page.tsx

    return (
        <OtpVerification
            heading="Verify your email"
            message={
                <span>
                    We sent a 6-digit verification code to <b>{email || "your email"}</b>. Enter it below.
                </span>
            }
            email={email || undefined}
            onVerify={onVerify} 
            onResend={resend}       // ✅ uses /send-verification-email
            otpLength={6}
            successTitle="Email verified!"
            onViewDashboard={() => router.push("/auth/login")}
            onContinueSetup={() => router.push("/auth/login")}
            
        />
    );
}
