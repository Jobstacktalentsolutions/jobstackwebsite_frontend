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
import { ResponseDto } from "@/app/types/response.type";

const base = "/auth/admin" as const;

export async function adminLogin(dto: LoginDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/login`,
    dto
  );
  return data.data;
}

export async function adminRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/refresh`,
    dto
  );
  return data.data;
}

export async function adminLogout() {
  await httpClient.delete(`${base}/logout`);
}

export async function adminSendVerificationEmail(
  dto: EmailVerificationRequestDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-verification-email`, dto);
  return data.data;
}

export async function adminVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/verify-email`,
    dto
  );
  return data.data;
}

export async function adminSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-password-reset-code`, dto);
  return data.data;
}

export async function adminConfirmPasswordResetCode(
  dto: PasswordResetConfirmCodeDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ resetToken: string; expiresAt: string | Date }>
  >(`${base}/confirm-password-reset-code`, dto);
  return data.data;
}

export async function adminResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/reset-password`,
    dto
  );
  return data.data;
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
