/**
 * Profile completion check utilities
 */

import { httpClient } from "@/app/api/http-client";
import { ResponseDto } from "@/app/types/response.type";

export interface JobSeekerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cvUrl?: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  skills?: Array<{ id: string; name: string }>;
  bio?: string;
  location?: string;
  yearsOfExperience?: number;
}

export interface RecruiterProfile {
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
}

export interface RecruiterVerification {
  id: string;
  recruiterId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
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
 * Check if recruiter profile is complete
 * A complete profile requires: company info and verification documents submitted
 */
export function isRecruiterProfileComplete(
  profile: RecruiterProfile,
  verification?: RecruiterVerification
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
  const { data } = await httpClient.get<
    ResponseDto<{ profile: JobSeekerProfile }>
  >("/user/jobseeker/me");
  return data.data.profile;
}

/**
 * Fetch recruiter profile from API
 */
export async function fetchRecruiterProfile(): Promise<RecruiterProfile> {
  const { data } = await httpClient.get<
    ResponseDto<{ profile: RecruiterProfile }>
  >("/user/recruiter/me");
  return data.data.profile;
}

/**
 * Fetch recruiter verification status from API
 */
export async function fetchRecruiterVerification(): Promise<RecruiterVerification> {
  const { data } = await httpClient.get<ResponseDto<RecruiterVerification>>(
    "/recruiters/verification"
  );
  return data.data;
}

/**
 * Check job seeker profile completion and return redirect path if incomplete
 */
export async function checkJobSeekerProfileCompletion(): Promise<
  string | null
> {
  try {
    const profile = await fetchJobSeekerProfile();

    if (!isJobSeekerProfileComplete(profile)) {
      return "/auth/jobseeker/complete-profile";
    }

    return null;
  } catch (error) {
    console.error("Error checking job seeker profile:", error);
    return null;
  }
}

/**
 * Check recruiter profile completion and return redirect path if incomplete
 */
export async function checkRecruiterProfileCompletion(): Promise<
  string | null
> {
  try {
    const [profile, verification] = await Promise.all([
      fetchRecruiterProfile(),
      fetchRecruiterVerification(),
    ]);

    if (!isRecruiterProfileComplete(profile, verification)) {
      return "/auth/employer/complete-profile";
    }

    return null;
  } catch (error) {
    console.error("Error checking recruiter profile:", error);
    return null;
  }
}
