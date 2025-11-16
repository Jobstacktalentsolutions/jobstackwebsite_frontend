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
import type { EmployerRegistrationDto } from "@/app/types/employer.type";
import { ResponseDto } from "@/app/types/response.type";

const base = "/auth/employer" as const;

export async function empRegister(dto: EmployerRegistrationDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/register`,
    dto
  );
  return data.data;
}

export async function empLogin(dto: LoginDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/login`,
    dto
  );
  return data.data;
}

export async function empRefresh(dto: RefreshTokenDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/refresh`,
    dto
  );
  return data.data;
}

export async function empLogout() {
  await httpClient.delete(`${base}/logout`);
}

export async function empSendVerificationEmail(
  dto: EmailVerificationRequestDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-verification-email`, dto);
  return data.data;
}

// Verify email - returns AuthResult with tokens
export async function empVerifyEmail(dto: EmailVerificationConfirmDto) {
  const { data } = await httpClient.post<ResponseDto<AuthResult>>(
    `${base}/verify-email`,
    dto
  );
  return data.data;
}

export async function empSendPasswordResetCode(dto: PasswordResetRequestDto) {
  const { data } = await httpClient.post<
    ResponseDto<{ sent: boolean; waitTime?: number; message?: string }>
  >(`${base}/send-password-reset-code`, dto);
  return data.data;
}

export async function empConfirmPasswordResetCode(
  dto: PasswordResetConfirmCodeDto
) {
  const { data } = await httpClient.post<
    ResponseDto<{ resetToken: string; expiresAt: string | Date }>
  >(`${base}/confirm-password-reset-code`, dto);
  return data.data;
}

export async function empResetPassword(dto: PasswordResetDto) {
  const { data } = await httpClient.post<ResponseDto<{ message?: string }>>(
    `${base}/reset-password`,
    dto
  );
  return data.data;
}

// Get employer profile
export async function empGetProfile() {
  const { data } = await httpClient.get<{ success: boolean; profile: any }>(
    "/user/employer/me"
  );
  return data.profile;
}

// Update employer profile
export async function empUpdateProfile(updateData: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  type?: string;
}) {
  const { data } = await httpClient.put<{
    success: boolean;
    profile: any;
  }>("/user/employer/profile", updateData);
  return data;
}

// Get employer company logo/profile picture
export async function empGetCompanyLogo() {
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
  }>("/user/employer/profile/company-logo");
  return data;
}

// Upload company logo
export async function empUploadCompanyLogo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post<{
    success: boolean;
    logoUrl: string;
  }>("/user/employer/profile/company-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// Delete company logo
export async function empDeleteCompanyLogo() {
  await httpClient.delete("/user/employer/profile/company-logo");
}

export default {
  empRegister,
  empLogin,
  empRefresh,
  empLogout,
  empSendVerificationEmail,
  empVerifyEmail,
  empSendPasswordResetCode,
  empConfirmPasswordResetCode,
  empResetPassword,
  empGetProfile,
  empUpdateProfile,
  empGetCompanyLogo,
  empUploadCompanyLogo,
  empDeleteCompanyLogo,
};
