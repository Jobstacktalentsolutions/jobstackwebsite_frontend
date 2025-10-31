"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import { jsVerifyEmail, jsSendVerificationEmail } from "@/app/api/auth-jobseeker.api";

interface Props {
    heading: string;
    message: React.ReactNode;
    email: string;
}

export default function VerifyClient({ heading, message, email }: Props) {
    const handleVerify = async (code: string) => {
        try {
            await jsVerifyEmail({ email, code });
            return true;
        } catch {
            return false;
        }
    };

    const handleResend = async () => {
        await jsSendVerificationEmail({ email });
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
