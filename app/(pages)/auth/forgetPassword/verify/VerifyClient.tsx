// app/auth/forgetPassword/verify/VerifyClient.tsx
"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";

type VerifyClientProps = {
    heading: string;
    message: React.ReactNode;
    email: string;
};

export default function VerifyClient({ heading, message, email }: VerifyClientProps) {
    const handleVerify = async (code: string) => {
        // TODO: call API to verify code + email
        return code === "245012";  // demo
    };

    const handleResend = async () => {
        // TODO: call API to resend code to email
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
