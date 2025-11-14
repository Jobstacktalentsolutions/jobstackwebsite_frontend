// app/auth/forgetPassword/verify/VerifyClient.tsx
"use client";

import ForgotPasswordVerify from "@/app/pages/components/forgotPasswordVerify";
import {
  empConfirmPasswordResetCode,
  empSendPasswordResetCode,
} from "@/app/api/auth-employer.api";
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
      const res = await empConfirmPasswordResetCode({ email, code });
      const token = res.resetToken;
      if (!token) {
        toastError(
          "Could not start password reset. Please request a new code."
        );
        return false;
      }
      toastSuccess("Code verified");
      router.push(
        `/employer/auth/forgetPassword/createNewPassword?resetToken=${encodeURIComponent(
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
    await empSendPasswordResetCode({ email });
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
