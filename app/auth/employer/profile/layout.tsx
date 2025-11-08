import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Profile | JobStack Employer",
  description: "Complete your employer profile to start hiring",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
