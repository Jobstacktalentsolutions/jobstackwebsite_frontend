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
  profilePictureId?: string;
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
  companyName?: string;
  companyAddress?: string;
  companySize?: string;
  state?: string;
  city?: string;
  socialOrWebsiteUrl?: string;
  companyRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessAddress?: string;
  documents?: Array<{
    id: string;
    type: string;
    documentType?: string;
    documentNumber?: string;
    fileName: string;
  }>;
}

/**
 * Check if job seeker profile is complete
 * A complete profile requires: CV uploaded and basic info filled
 */
export function isJobSeekerProfileComplete(profile: JobSeekerProfile): boolean {
  return !needsJobSeekerProfileCompletion(profile);
}

/**
 * Check if employer profile is complete
 * A complete profile requires: company info and verification documents submitted
 */
export function isEmployerProfileComplete(
  profile: EmployerProfile,
  verification?: EmployerVerification
): boolean {
  return !needsEmployerProfileCompletion(profile, verification);
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
    return needsJobSeekerProfileCompletion(profile)
      ? "/pages/jobseeker/auth/complete-profile"
      : null;
  } catch (error) {
    console.error("Error checking job seeker profile:", error);
    // On error, redirect to profile page to be safe
    return "/pages/jobseeker/auth/complete-profile";
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

    return needsEmployerProfileCompletion(profile, verification)
      ? "/pages/employer/auth/complete-profile"
      : null;
  } catch (error) {
    console.error("Error checking employer profile:", error);
    // On error, don't redirect - let them access the dashboard
    return null;
  }
}

function hasValue(value?: string | number | null) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
}

function hasJobSeekerRequiredFields(profile: JobSeekerProfile): boolean {
  const requiredStrings = [
    profile.firstName,
    profile.lastName,
    profile.phoneNumber,
    profile.jobTitle,
    profile.address,
    profile.state,
    profile.city,
    profile.brief || profile.bio,
  ];

  const hasSkills =
    (profile.userSkills && profile.userSkills.length > 0) ||
    (profile.skills && profile.skills.length > 0);

  const hasCv = Boolean(profile.cvDocumentId) || Boolean(profile.cvUrl);

  return requiredStrings.every(hasValue) && !!hasSkills && !!hasCv;
}

function hasEmployerRequiredFields(
  profile: EmployerProfile,
  verification?: EmployerVerification | null
): boolean {
  if (!verification) {
    return false;
  }

  const requiredStrings = [
    verification.companyName || profile.companyName,
    verification.companyAddress,
    verification.state,
    verification.city,
  ];

  if (profile.type && profile.type !== "INDIVIDUAL") {
    requiredStrings.push(verification.companySize);
  }

  const hasDocuments =
    Array.isArray(verification.documents) && verification.documents.length > 0;

  return requiredStrings.every(hasValue) && hasDocuments;
}

export function needsJobSeekerProfileCompletion(
  profile: JobSeekerProfile
): boolean {
  if (profile.approvalStatus === ApprovalStatus.NOT_STARTED) {
    return true;
  }

  return !hasJobSeekerRequiredFields(profile);
}

export function needsEmployerProfileCompletion(
  profile: EmployerProfile,
  verification?: EmployerVerification | null
): boolean {
  if (!verification) {
    return true;
  }

  if (verification.status === VerificationStatus.NOT_STARTED) {
    return true;
  }

  if (verification.status === VerificationStatus.REJECTED) {
    return true;
  }

  return !hasEmployerRequiredFields(profile, verification);
}
