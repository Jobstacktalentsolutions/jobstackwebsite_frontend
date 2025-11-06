// app/auth/forgetPassword/verify/VerifyClient.tsx
"use client";

import ForgotPasswordVerify from "@/app/components/forgotPasswordVerify";
import {
  jsConfirmPasswordResetCode,
  jsSendPasswordResetCode,
} from "@/app/api/auth-jobseeker.api";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError, toastInfo } from "@/app/lib/toast";

type VerifyClientProps = {
  message: React.ReactNode;
  email: string;
};

export default function VerifyClient({ message, email }: VerifyClientProps) {
  const router = useRouter();

  const handleVerify = async (code: string) => {
    try {
      const res = await jsConfirmPasswordResetCode({ email, code });
      const token = res.resetToken;
      if (!token) {
        toastError(
          "Could not start password reset. Please request a new code."
        );
        return false;
      }
      toastSuccess("Code verified");
      router.push(
        `/auth/jobseeker/forgetPassword/createNewPassword?resetToken=${encodeURIComponent(
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
    await jsSendPasswordResetCode({ email });
    toastInfo("We resent the code to your email");
  };

  return (
    <ForgotPasswordVerify
      message={message}
      email={email}
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
}
