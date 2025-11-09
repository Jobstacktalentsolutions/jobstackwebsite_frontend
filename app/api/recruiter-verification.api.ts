import { httpClient } from "./http-client";
import { ResponseDto } from "@/app/types/response.type";
import type {
  RecruiterVerification,
  RecruiterVerificationDocument,
  UpdateVerificationInfoDto,
  UploadVerificationDocumentDto,
  AutoVerificationResult,
  DocumentRequirement,
} from "@/app/types/recruiter.type";

const base = "/recruiters/verification" as const;

export async function getMyProfile(): Promise<any> {
  const { data } = await httpClient.get<{ success: boolean; profile: any }>(
    "/user/recruiter/me"
  );
  return data.profile;
}

export async function getMyVerification(): Promise<RecruiterVerification | null> {
  const { data } = await httpClient.get<
    ResponseDto<RecruiterVerification | null>
  >(base);
  return data.data;
}

export async function updateVerificationInfo(
  dto: UpdateVerificationInfoDto
): Promise<RecruiterVerification> {
  const { data } = await httpClient.put<ResponseDto<RecruiterVerification>>(
    base,
    dto
  );
  return data.data;
}

export async function uploadVerificationDocument(
  dto: UploadVerificationDocumentDto,
  file: File
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

  console.log("Uploading document:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    documentType: dto.documentType,
  });

  // Don't set Content-Type - axios will automatically set it with boundary for FormData
  const { data } = await httpClient.post<
    ResponseDto<
      RecruiterVerificationDocument & {
        autoVerificationResult?: AutoVerificationResult;
      }
    >
  >(`${base}/documents`, formData);
  return data.data;
}

export async function getMyVerificationDocuments(): Promise<
  RecruiterVerificationDocument[]
> {
  const { data } = await httpClient.get<
    ResponseDto<RecruiterVerificationDocument[]>
  >(`${base}/documents`);
  return data.data;
}

export async function deleteVerificationDocument(
  documentId: string
): Promise<{ message: string }> {
  const { data } = await httpClient.delete<ResponseDto<{ message: string }>>(
    `${base}/documents/${documentId}`
  );
  return data.data;
}

export async function getDocumentRequirements(): Promise<
  DocumentRequirement[]
> {
  const { data } = await httpClient.get<ResponseDto<DocumentRequirement[]>>(
    `${base}/requirements`
  );
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
};
