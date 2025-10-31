import type { LoginDto, RefreshTokenDto, EmailVerificationConfirmDto, EmailVerificationRequestDto, PasswordResetConfirmCodeDto, PasswordResetDto, PasswordResetRequestDto, AuthResult } from "./auth.type";

export interface JobSeekerRegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // NG format
}

export type JobSeekerRegisterResponse = {
  message: string;
  data: AuthResult;
};

export type { LoginDto, RefreshTokenDto, EmailVerificationConfirmDto, EmailVerificationRequestDto, PasswordResetConfirmCodeDto, PasswordResetDto, PasswordResetRequestDto };