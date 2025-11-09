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

// Verification Status for Recruiters
export enum VerificationStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// User Roles
export enum UserRole {
  JOB_SEEKER = "JOB_SEEKER",
  RECRUITER = "RECRUITER",
  ADMIN = "ADMIN",
}

// Skill Proficiency Levels
export enum Proficiency {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}
