import { UserRole as UserRoleEnum } from "../lib/enums";

// Use the enum values to match backend
export type UserRole =
  | UserRoleEnum.JOB_SEEKER
  | UserRoleEnum.EMPLOYER
  | UserRoleEnum.ADMIN;

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface EmailVerificationRequestDto {
  email: string;
}

export interface EmailVerificationConfirmDto {
  email: string;
  code: string; // 6 chars
}

export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetConfirmCodeDto {
  email: string;
  code: string; // 6 chars
}

export interface PasswordResetDto {
  resetToken: string;
  newPassword: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    profileId?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  };
  expiresAt: string | Date;
  sessionId: string;
}
