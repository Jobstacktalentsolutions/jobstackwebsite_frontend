"use client";

import VerificationWarningBanner from "@/app/components/VerificationWarningBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VerificationWarningBanner />
      {children}
    </>
  );
}
