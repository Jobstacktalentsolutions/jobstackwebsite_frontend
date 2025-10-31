"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";

interface Props {
    heading: string;
    message: React.ReactNode;

}

export default function VerifyClient({ heading, message }: Props) {
    const handleVerify = async (code: string) => {
        try {
            const response = await fetch("https://jobstack-backend-api-production.up.railway.app/api/auth/jobseeker/verify-email", {
                method: "POST",
                headers: {
                
                    // 'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Verification failed:", data);
                return false;
            }

            // You can adjust this based on your Apidog response format:
            return data.success === true;
        } catch (error) {
            console.error("Error verifying code:", error);
            return false;
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch("https://jobstack-backend-api-production.up.railway.app/api/auth/jobseeker/send-verification-email", {
                method: "POST",
                headers: {
                    // 'Authorization': 'Bearer <token>',
                    // 'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                    email: sessionStorage.getItem("userEmail"), // Example payload
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to resend code");
            console.log("Verification code resent:", data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <ForgotPasswordVerify
            heading={heading}
            message={message}

            onVerify={handleVerify}
            onResend={handleResend}
        />
    );
}
