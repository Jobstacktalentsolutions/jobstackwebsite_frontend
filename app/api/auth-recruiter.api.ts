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
import type { RecruiterRegistrationDto } from "@/app/types/recruiter.type";
import { ResponseDto } from "@/app/types/response.type";

const base = "/auth/recruiter" as const;

export async function rcRegister(dto: RecruiterRegistrationDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/register`,
    dto
  );
  return data.data;
}

export async function rcLogin(dto: LoginDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/login`,
    dto
  );
  return data.data;
}

export async function rcRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/refresh`,
    dto
  );
  return data.data;
}

export async function rcLogout() {
  await httpClient.delete(`${base}/logout`);
}

export async function rcSendVerificationEmail(
  dto: EmailVerificationRequestDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-verification-email`, dto);
  return data.data;
}

export async function rcVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/verify-email`,
    dto
  );
  return data.data;
}

export async function rcSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-password-reset-code`, dto);
  return data.data;
}

export async function rcConfirmPasswordResetCode(
  dto: PasswordResetConfirmCodeDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ resetToken: string; expiresAt: string | Date }>
  >(`${base}/confirm-password-reset-code`, dto);
  return data.data;
}

export async function rcResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/reset-password`,
    dto
  );
  return data.data;
}

export default {
  rcRegister,
  rcLogin,
  rcRefresh,
  rcLogout,
  rcSendVerificationEmail,
  rcVerifyEmail,
  rcSendPasswordResetCode,
  rcConfirmPasswordResetCode,
  rcResetPassword,
};
