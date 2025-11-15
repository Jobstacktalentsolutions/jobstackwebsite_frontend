/**
 * Centralized enums for the application
 * All enum constants should be imported from this file
 */

// Approval Status for Job Seekers
export enum ApprovalStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Verification Status for Employers
export enum VerificationStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// User Roles - must match backend UserRole enum values
export enum UserRole {
  JOB_SEEKER = "JOBSEEKER",
  EMPLOYER = "EMPLOYER",
  ADMIN = "ADMIN",
}

// Skill Proficiency Levels
export enum Proficiency {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}
