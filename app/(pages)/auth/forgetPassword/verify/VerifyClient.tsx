// app/auth/forgetPassword/verify/VerifyClient.tsx
"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import { jsConfirmPasswordResetCode, jsSendPasswordResetCode } from "@/app/api/auth-jobseeker.api";
import { useRouter } from "next/navigation";

type VerifyClientProps = {
    heading: string;
    message: React.ReactNode;
    email: string;
};

export default function VerifyClient({ heading, message, email }: VerifyClientProps) {
    const router = useRouter();

    const handleVerify = async (code: string) => {
        try {
            const res = await jsConfirmPasswordResetCode({ email, code });
            const token = res.resetToken;
            router.push(`/auth/forgetPassword/createNewPassword?token=${encodeURIComponent(token)}`);
            return true;
        } catch {
            return false;
        }
    };

    const handleResend = async () => {
        await jsSendPasswordResetCode({ email });
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
