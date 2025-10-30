"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";

interface Props {
    heading: string;
    message: React.ReactNode;
    email: string;
}

export default function VerifyClient({ heading, message, email }: Props) {
    const handleVerify = async (code: string) => {
        // call your API or logic
        return code === "245012";
    };

    const handleResend = async () => {
        // call your API resend endpoint
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
