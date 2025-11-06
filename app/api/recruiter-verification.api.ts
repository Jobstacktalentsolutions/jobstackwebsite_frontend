import { httpClient } from "./http-client";
import { ResponseDto } from "@/app/types/response.type";
import type {
  RecruiterVerification,
  RecruiterVerificationDocument,
  UpdateVerificationInfoDto,
  UploadVerificationDocumentDto,
  AutoVerificationEligibility,
  AutoVerificationResult,
  DocumentRequirement,
} from "@/app/types/recruiter.type";

const base = "/recruiters/verification" as const;

function authHeader(accessToken?: string) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}

export async function getMyProfile(accessToken?: string): Promise<any> {
  const { data } = await httpClient.get<{ success: boolean; profile: any }>(
    "/user/recruiter/me",
    {
      headers: authHeader(accessToken),
    }
  );
  return data.profile;
}

export async function getMyVerification(
  accessToken?: string
): Promise<RecruiterVerification | null> {
  const { data } = await httpClient.get<
    ResponseDto<RecruiterVerification | null>
  >(base, {
    headers: authHeader(accessToken),
  });
  return data.data;
}

export async function updateVerificationInfo(
  dto: UpdateVerificationInfoDto,
  accessToken?: string
): Promise<RecruiterVerification> {
  const { data } = await httpClient.patch<ResponseDto<RecruiterVerification>>(
    base,
    dto,
    {
      headers: authHeader(accessToken),
    }
  );
  return data.data;
}

export async function uploadVerificationDocument(
  dto: UploadVerificationDocumentDto,
  file: File,
  accessToken?: string
): Promise<
  RecruiterVerificationDocument & {
    autoVerificationResult?: AutoVerificationResult;
  }
> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", dto.documentType);
  if (dto.documentNumber) {
    formData.append("documentNumber", dto.documentNumber);
  }

  const { data } = await httpClient.post<
    ResponseDto<
      RecruiterVerificationDocument & {
        autoVerificationResult?: AutoVerificationResult;
      }
    >
  >(`${base}/documents`, formData, {
    headers: {
      ...authHeader(accessToken),
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
}

export async function getMyVerificationDocuments(
  accessToken?: string
): Promise<RecruiterVerificationDocument[]> {
  const { data } = await httpClient.get<
    ResponseDto<RecruiterVerificationDocument[]>
  >(`${base}/documents`, {
    headers: authHeader(accessToken),
  });
  return data.data;
}

export async function deleteVerificationDocument(
  documentId: string,
  accessToken?: string
): Promise<{ message: string }> {
  const { data } = await httpClient.delete<ResponseDto<{ message: string }>>(
    `${base}/documents/${documentId}`,
    {
      headers: authHeader(accessToken),
    }
  );
  return data.data;
}

export async function getDocumentRequirements(
  accessToken?: string
): Promise<DocumentRequirement[]> {
  const { data } = await httpClient.get<ResponseDto<DocumentRequirement[]>>(
    `${base}/requirements`,
    {
      headers: authHeader(accessToken),
    }
  );
  return data.data;
}

export async function checkAutoVerificationEligibility(
  accessToken?: string
): Promise<AutoVerificationEligibility> {
  const { data } = await httpClient.get<
    ResponseDto<AutoVerificationEligibility>
  >(`${base}/auto-verification-eligibility`, {
    headers: authHeader(accessToken),
  });
  return data.data;
}

export default {
  getMyProfile,
  getMyVerification,
  updateVerificationInfo,
  uploadVerificationDocument,
  getMyVerificationDocuments,
  deleteVerificationDocument,
  getDocumentRequirements,
  checkAutoVerificationEligibility,
};
