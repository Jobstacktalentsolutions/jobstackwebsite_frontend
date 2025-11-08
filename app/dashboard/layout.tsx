import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | JobStack",
  description: "Manage your JobStack account and activities",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
