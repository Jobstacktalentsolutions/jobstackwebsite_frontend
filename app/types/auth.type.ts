export type UserRole = "JobSeeker" | "Recruiter" | "Admin";

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
  };
  expiresAt: string | Date;
  sessionId: string;
}