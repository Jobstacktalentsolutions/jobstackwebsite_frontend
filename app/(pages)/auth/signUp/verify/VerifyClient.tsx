"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import { jsVerifyEmail, jsSendVerificationEmail } from "@/app/api/auth-jobseeker.api";
import { toastSuccess, toastError, toastInfo } from "@/app/lib/toast";

interface Props {
    heading: string;
    message: React.ReactNode;
    email: string;
}

export default function VerifyClient({ heading, message, email }: Props) {
    const handleVerify = async (code: string) => {
        try {
            await jsVerifyEmail({ email, code });
            toastSuccess("Email verified successfully");
            return true;
        } catch {
            toastError("Verification failed");
            return false;
        }
    };

    const handleResend = async () => {
        await jsSendVerificationEmail({ email });
        toastInfo("Verification email resent");
    };

    return (
        <ForgotPasswordVerify
            heading={heading}
            message={message}
            email={email}
            onVerify={handleVerify}
            onResend={handleResend}
        />
    );
}
