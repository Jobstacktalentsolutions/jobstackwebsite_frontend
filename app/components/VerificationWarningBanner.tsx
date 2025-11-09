"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/app/lib/auth-context";
import { VerificationStatus } from "@/app/lib/enums";

/**
 * Warning banner component that shows when recruiter is not verified
 */
export default function VerificationWarningBanner() {
  const { profile } = useProfile();

  // Only show for recruiters
  if (!profile?.recruiter) {
    return null;
  }

  const verification = profile.recruiter.verification;
  const status = verification?.status;

  // Only show if verification is pending or rejected (not NOT_STARTED or APPROVED)
  if (
    status === VerificationStatus.APPROVED ||
    status === VerificationStatus.NOT_STARTED ||
    !verification
  ) {
    return null;
  }

  const getMessage = () => {
    if (status === VerificationStatus.REJECTED) {
      return "Your verification has been rejected. Please update your profile to resubmit.";
    }
    return "Your account verification is pending. Complete your profile to get verified.";
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">{getMessage()}</p>
          </div>
          <Link
            href="/auth/employer/profile"
            className="text-sm font-medium text-amber-900 hover:text-amber-700 underline flex-shrink-0"
          >
            Complete Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
