// app/auth/forgetPassword/verify/VerifyClient.tsx
"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import {
  rcConfirmPasswordResetCode,
  rcSendPasswordResetCode,
} from "@/app/api/auth-recruiter.api";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError, toastInfo } from "@/app/lib/toast";

type VerifyClientProps = {
  heading: string;
  message: React.ReactNode;
  email: string;
};

export default function VerifyClient({
  heading,
  message,
  email,
}: VerifyClientProps) {
  const router = useRouter();

  const handleVerify = async (code: string) => {
    try {
      const res = await rcConfirmPasswordResetCode({ email, code });
      const token = res.resetToken;
      if (!token) {
        toastError(
          "Could not start password reset. Please request a new code."
        );
        return false;
      }
      toastSuccess("Code verified");
      router.push(
        `/auth/employer/forgetPassword/createNewPassword?resetToken=${encodeURIComponent(
          token
        )}`
      );
      return true;
    } catch {
      toastError("Invalid code");
      return false;
    }
  };

  const handleResend = async () => {
    await rcSendPasswordResetCode({ email });
    toastInfo("We resent the code to your email");
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
