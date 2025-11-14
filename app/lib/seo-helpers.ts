import type { Metadata } from "next";

/**
 * Generate metadata for protected pages
 * This ensures proper SEO even for authenticated pages
 */
export function generateProtectedPageMetadata(
  title: string,
  description: string,
  options?: {
    noIndex?: boolean;
    canonical?: string;
  }
): Metadata {
  return {
    title: `${title} | JobStack`,
    description,
    // Prevent indexing of authenticated pages by default
    robots:
      options?.noIndex !== false
        ? {
            index: false,
            follow: false,
          }
        : undefined,
    ...(options?.canonical && {
      alternates: {
        canonical: options.canonical,
      },
    }),
  };
}

/**
 * Common metadata for dashboard pages
 */
export const dashboardMetadata: Metadata = generateProtectedPageMetadata(
  "Dashboard",
  "Manage your JobStack account and activities",
  { noIndex: true }
);

/**
 * Common metadata for profile pages
 */
export const profileMetadata: Metadata = generateProtectedPageMetadata(
  "Profile",
  "Complete and manage your profile",
  { noIndex: true }
);

/**
 * Metadata for employer dashboard
 */
export const employerDashboardMetadata: Metadata =
  generateProtectedPageMetadata(
    "Employer Dashboard",
    "Manage your job postings and applications",
    { noIndex: true }
  );

/**
 * Metadata for job seeker dashboard
 */
export const jobSeekerDashboardMetadata: Metadata =
  generateProtectedPageMetadata(
    "Job Seeker Dashboard",
    "Find and apply for jobs",
    { noIndex: true }
  );
