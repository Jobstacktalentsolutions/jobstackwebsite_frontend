"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import { jsVerifyEmail } from "@/app/api/auth-jobseeker.api";
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
    // Resend only on user action (initial send handled by previous step)
    const { jsSendVerificationEmail } = await import("@/app/api/auth-jobseeker.api");
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
