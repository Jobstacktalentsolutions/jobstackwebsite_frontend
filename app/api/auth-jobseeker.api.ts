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
import type {
  JobSeekerRegistrationDto,
  JobSeekerRegisterResponse,
} from "@/app/types/jobseeker.type";
import { ResponseDto } from "@/app/types/response.type";

const base = "/auth/jobseeker" as const;

export async function jsRegister(dto: JobSeekerRegistrationDto) {
  const { data } = await httpClient.post<
    ResponseDto<JobSeekerRegisterResponse>
  >(`${base}/register`, dto);
  return data.data;
}

export async function jsLogin(dto: LoginDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/login`,
    dto
  );
  return data.data;
}

export async function jsRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/refresh`,
    dto
  );
  return data.data;
}

export async function jsLogout() {
  await httpClient.delete(`${base}/logout`);
}

export async function jsSendVerificationEmail(
  dto: EmailVerificationRequestDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-verification-email`, dto);
  return data.data;
}

export async function jsVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/verify-email`,
    dto
  );
  return data.data;
}

export async function jsSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-password-reset-code`, dto);
  return data.data;
}

export async function jsConfirmPasswordResetCode(
  dto: PasswordResetConfirmCodeDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ resetToken: string; expiresAt: string | Date }>
  >(`${base}/confirm-password-reset-code`, dto);
  return data.data;
}

export async function jsResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/reset-password`,
    dto
  );
  return data.data;
}

// Get jobseeker CV document
export async function jsGetCvDocument() {
  const { data } = await httpClient.get<{
    success: boolean;
    document: {
      id: string;
      fileName: string;
      originalName: string;
      mimeType: string;
      size: number;
      type: string;
      description?: string;
      createdAt: string;
    };
    signedUrl: string;
  }>("/user/jobseeker/profile/cv");
  return data;
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
  jsGetCvDocument,
};
