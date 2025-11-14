/**
 * Profile completion check utilities
 */

import { httpClient } from "@/app/api/http-client";
import { ResponseDto } from "@/app/types/response.type";
import { ApprovalStatus, VerificationStatus } from "@/app/lib/enums";

export interface JobSeekerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cvUrl?: string;
  cvDocumentId?: string;
  approvalStatus: ApprovalStatus;
  skills?: Array<{ id: string; name: string }>;
  userSkills?: Array<{
    id: string;
    skillId: string;
    proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    yearsExperience?: number;
    skill: {
      id: string;
      name: string;
    };
  }>;
  bio?: string;
  brief?: string;
  location?: string;
  preferredLocation?: string;
  address?: string;
  state?: string;
  city?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  minExpectedSalary?: number;
  maxExpectedSalary?: number;
}

export interface EmployerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  type?: "INDIVIDUAL" | "AGENCY" | "COMPANY";
  verification?: EmployerVerification;
}

export interface EmployerVerification {
  id: string;
  employerId: string;
  status: VerificationStatus;
  companyRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessAddress?: string;
  documents?: Array<{
    id: string;
    type: string;
    fileName: string;
  }>;
}

/**
 * Check if job seeker profile is complete
 * A complete profile requires: CV uploaded and basic info filled
 */
export function isJobSeekerProfileComplete(profile: JobSeekerProfile): boolean {
  return !!(
    profile.firstName &&
    profile.lastName &&
    profile.phoneNumber &&
    profile.cvUrl &&
    profile.bio &&
    profile.location
  );
}

/**
 * Check if employer profile is complete
 * A complete profile requires: company info and verification documents submitted
 */
export function isEmployerProfileComplete(
  profile: EmployerProfile,
  verification?: EmployerVerification
): boolean {
  const hasBasicInfo = !!(
    profile.firstName &&
    profile.lastName &&
    profile.phoneNumber &&
    profile.companyName &&
    profile.type
  );

  const hasVerificationDocs =
    verification?.documents && verification.documents.length > 0;

  return hasBasicInfo && !!hasVerificationDocs;
}

/**
 * Fetch job seeker profile from API
 */
export async function fetchJobSeekerProfile(): Promise<JobSeekerProfile> {
  const { data } = await httpClient.get<ResponseDto<JobSeekerProfile>>(
    "/user/jobseeker/me"
  );

  console.log("data", data);
  return data.data;
}

/**
 * Fetch employer profile from API
 */
export async function fetchEmployerProfile(): Promise<EmployerProfile> {
  const { data } = await httpClient.get<
    ResponseDto<{ profile: EmployerProfile }>
  >("/user/employer/me");
  return data.data.profile;
}

/**
 * Fetch employer verification status from API (deprecated - use verification from profile)
 */
export async function fetchEmployerVerification(): Promise<EmployerVerification | null> {
  try {
    const { data } = await httpClient.get<ResponseDto<EmployerVerification>>(
      "/employers/verification"
    );
    return data.data;
  } catch (error) {
    console.error("Error fetching verification:", error);
    return null;
  }
}

/**
 * Check job seeker profile completion and return redirect path if incomplete
 */
export async function checkJobSeekerProfileCompletion(): Promise<
  string | null
> {
  try {
    const profile = await fetchJobSeekerProfile();

    // Only redirect to onboarding if status is NOT_STARTED
    if (profile.approvalStatus === ApprovalStatus.NOT_STARTED) {
      return "/pages/jobseeker/auth/profile";
    }

    // If profile is incomplete but status is not NOT_STARTED, don't redirect
    // (they've already started onboarding)
    if (!isJobSeekerProfileComplete(profile)) {
      return null;
    }

    return null;
  } catch (error) {
    console.error("Error checking job seeker profile:", error);
    // On error, redirect to profile page to be safe
    return "/pages/jobseeker/auth/profile";
  }
}

/**
 * Check employer profile completion and return redirect path if incomplete
 */
export async function checkEmployerProfileCompletion(): Promise<string | null> {
  try {
    const profile = await fetchEmployerProfile();
    // Use verification from profile instead of separate fetch
    const verification = profile.verification || null;

    // If verification is null or status is NOT_STARTED, redirect to onboarding
    if (
      !verification ||
      verification.status === VerificationStatus.NOT_STARTED
    ) {
      return " /pages/employer/auth/profile";
    }

    // If status is PENDING, APPROVED, or REJECTED, don't redirect
    // (they've already started onboarding or completed it)
    // Only redirect if status is NOT_STARTED

    return null;
  } catch (error) {
    console.error("Error checking employer profile:", error);
    // On error, don't redirect - let them access the dashboard
    return null;
  }
}
