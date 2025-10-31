import type { LoginDto, RefreshTokenDto, EmailVerificationConfirmDto, EmailVerificationRequestDto, PasswordResetConfirmCodeDto, PasswordResetDto, PasswordResetRequestDto } from "./auth.type";

export interface RecruiterRegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // NG format
}

export type { LoginDto, RefreshTokenDto, EmailVerificationConfirmDto, EmailVerificationRequestDto, PasswordResetConfirmCodeDto, PasswordResetDto, PasswordResetRequestDto };