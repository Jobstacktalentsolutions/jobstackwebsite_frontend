import type {
  LoginDto,
  RefreshTokenDto,
  EmailVerificationConfirmDto,
  EmailVerificationRequestDto,
  PasswordResetConfirmCodeDto,
  PasswordResetDto,
  PasswordResetRequestDto,
} from "./auth.type";

export interface RecruiterRegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // NG format
  type?: EmployerType; // Optional for now
}

// Employer Types
export enum EmployerType {
  INDIVIDUAL = "Individual",
  SME = "SME",
  ORGANIZATION = "Organization",
}

// Document Types
export enum RecruiterDocumentType {
  // Individual documents
  NATIONAL_ID = "NATIONAL_ID",
  INTERNATIONAL_PASSPORT = "INTERNATIONAL_PASSPORT",
  PROOF_OF_ADDRESS = "PROOF_OF_ADDRESS",
  GUARANTOR_DETAILS = "GUARANTOR_DETAILS",
  SERVICE_AGREEMENT = "SERVICE_AGREEMENT",
  PAYMENT_METHOD = "PAYMENT_METHOD",

  // SME/Small Business documents
  CERTIFICATE_OF_BUSINESS_REGISTRATION = "CERTIFICATE_OF_BUSINESS_REGISTRATION",
  COMPANY_ID = "COMPANY_ID",
  TAX_IDENTIFICATION = "TAX_IDENTIFICATION",
  CORPORATE_PAYMENT_DETAILS = "CORPORATE_PAYMENT_DETAILS",

  // Large Organization documents
  CERTIFICATE_OF_INCORPORATION = "CERTIFICATE_OF_INCORPORATION",
  CORPORATE_PROFILE = "CORPORATE_PROFILE",
  AUTHORIZATION_LETTER = "AUTHORIZATION_LETTER",
  CORPORATE_ACCOUNT_DETAILS = "CORPORATE_ACCOUNT_DETAILS",
}

// Re-export enums from centralized location
import { VerificationStatus } from "@/app/lib/enums";
export { VerificationStatus };

// Document Requirement Interface
export interface DocumentRequirement {
  documentType: RecruiterDocumentType;
  mandatory: boolean;
  description: string;
  purpose: string;
}

// Verification Document Interface
export interface RecruiterVerificationDocument {
  id: string;
  documentType: RecruiterDocumentType;
  documentNumber?: string;
  verified: boolean;
  createdAt: string;
  document: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
  };
}

// Verification Interface
export interface RecruiterVerification {
  id: string;
  recruiterId: string;
  companyName?: string;
  companyAddress?: string;
  state?: string;
  city?: string;
  companySize?: string;
  socialOrWebsiteUrl?: string;
  status: VerificationStatus;
  reviewedByAdminId?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  documents: RecruiterVerificationDocument[];
  recruiter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type?: EmployerType;
  };
}

// Auto-verification eligibility response
export interface AutoVerificationEligibility {
  canAutoVerify: boolean;
  missingMandatoryDocuments: string[];
  verificationStatus: VerificationStatus;
}

// Auto-verification result
export interface AutoVerificationResult {
  verified: boolean;
  message: string;
}

// DTOs for API calls
export interface UpdateVerificationInfoDto {
  companyName?: string;
  companyAddress?: string;
  state?: string;
  city?: string;
  companySize?: string;
  socialOrWebsiteUrl?: string;
}

export interface UploadVerificationDocumentDto {
  documentType: RecruiterDocumentType;
  documentNumber?: string;
}

export interface UpdateVerificationStatusDto {
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface UpdateDocumentVerificationDto {
  verified: boolean;
}

export type {
  LoginDto,
  RefreshTokenDto,
  EmailVerificationConfirmDto,
  EmailVerificationRequestDto,
  PasswordResetConfirmCodeDto,
  PasswordResetDto,
  PasswordResetRequestDto,
};
