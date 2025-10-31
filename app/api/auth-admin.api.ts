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

const base = "/auth/admin" as const;

function authHeader(accessToken?: string) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}

export async function adminLogin(dto: LoginDto) {
  const { data } = await httpClient.post<AuthResult>(`${base}/login`, dto);
  return data;
}

export async function adminRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<AuthResult>(`${base}/refresh`, dto);
  return data;
}

export async function adminLogout(accessToken?: string) {
  await httpClient.delete(`${base}/logout`, {
    headers: authHeader(accessToken),
  });
}

export async function adminSendVerificationEmail(
  dto: EmailVerificationRequestDto
) {
  const { data } = await httpClient.post(
    `${base}/send-verification-email`,
    dto
  );
  return data as { sent: boolean; waitTime?: number; message?: string };
}

export async function adminVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post(`${base}/verify-email`, dto);
  return data as { message?: string };
}

export async function adminSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post(
    `${base}/send-password-reset-code`,
    dto
  );
  return data as { sent: boolean; waitTime?: number; message?: string };
}

export async function adminConfirmPasswordResetCode(
  dto: PasswordResetConfirmCodeDto
) {
  const { data } = await httpClient.post(
    `${base}/confirm-password-reset-code`,
    dto
  );
  return data as { resetToken: string; expiresAt: string | Date };
}

export async function adminResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post(`${base}/reset-password`, dto);
  return data as { message?: string };
}

export default {
  adminLogin,
  adminRefresh,
  adminLogout,
  adminSendVerificationEmail,
  adminVerifyEmail,
  adminSendPasswordResetCode,
  adminConfirmPasswordResetCode,
  adminResetPassword,
};
