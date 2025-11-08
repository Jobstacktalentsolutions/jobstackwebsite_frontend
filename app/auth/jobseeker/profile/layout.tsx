import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Profile | JobStack Job Seeker",
  description: "Complete your profile to start applying for jobs",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JobSeekerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
