// app/pages/employer/layout.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Dashboard | JobStack",
  description: "Manage your job postings and applications",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
