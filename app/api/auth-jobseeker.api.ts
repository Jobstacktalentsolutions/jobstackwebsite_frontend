import { httpClient } from "./http-client";
import type {
  AuthResult,
  EmailVerificationConfirmDto,
  EmailVerificationRequestDto,
  LoginDto,
  PasswordResetConfirmCodeDto,
  PasswordResetDto,
  PasswordResetRequestDto,
  RefreshTokenDto,
} from "@/app/types/auth.type";
import type { JobSeekerRegistrationDto, JobSeekerRegisterResponse } from "@/app/types/jobseeker.type";

const base = "/auth/jobseeker" as const;

function authHeader(accessToken?: string) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}

export async function jsRegister(dto: JobSeekerRegistrationDto) {
  const { data } = await httpClient.post<JobSeekerRegisterResponse>(`${base}/register`, dto);
  return data;
}

export async function jsLogin(dto: LoginDto) {
  const { data } = await httpClient.post<AuthResult>(`${base}/login`, dto);
  return data;
}

export async function jsRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<AuthResult>(`${base}/refresh`, dto);
  return data;
}

export async function jsLogout(accessToken?: string) {
  await httpClient.delete(`${base}/logout`, { headers: authHeader(accessToken) });
}

export async function jsSendVerificationEmail(dto: EmailVerificationRequestDto) {
  const { data } = await httpClient.post(`${base}/send-verification-email`, dto);
  return data as { sent: boolean; waitTime?: number; message?: string };
}

export async function jsVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post(`${base}/verify-email`, dto);
  return data as { message?: string };
}

export async function jsSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post(`${base}/send-password-reset-code`, dto);
  return data as { sent: boolean; waitTime?: number; message?: string };
}

export async function jsConfirmPasswordResetCode(dto: PasswordResetConfirmCodeDto) {
  const { data } = await httpClient.post(`${base}/confirm-password-reset-code`, dto);
  return data as { resetToken: string; expiresAt: string | Date };
}

export async function jsResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post(`${base}/reset-password`, dto);
  return data as { message?: string };
}

export default {
  jsRegister,
  jsLogin,
  jsRefresh,
  jsLogout,
  jsSendVerificationEmail,
  jsVerifyEmail,
  jsSendPasswordResetCode,
  jsConfirmPasswordResetCode,
  jsResetPassword,
};