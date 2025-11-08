"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/app/components/AuthPageLayout";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import { Building2, MapPin, Globe, Users } from "lucide-react";
import { toastSuccess, toastError, toastInfo } from "@/app/lib/toast";
import statesAndCities from "@/app/lib/states-and-cities.json";
import { SearchableSelect } from "@/app/components/SearchableSelect";
import {
  getMyProfile,
  updateVerificationInfo,
  uploadVerificationDocument,
  getDocumentRequirements,
  getMyVerification,
  checkAutoVerificationEligibility,
} from "@/app/api/recruiter-verification.api";
import {
  UpdateVerificationInfoDto,
  DocumentRequirement,
  RecruiterType,
  RecruiterDocumentType,
  RecruiterVerification,
} from "@/app/types/recruiter.type";

interface DocumentUpload {
  documentType: RecruiterDocumentType;
  file: File | null;
  documentNumber?: string;
  uploaded: boolean;
  uploading: boolean;
}

const ProfilePage = () => {
  const router = useRouter();

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [socialOrWebsiteUrl, setSocialOrWebsiteUrl] = useState("");

  // Document state
  const [recruiterType, setRecruiterType] = useState<RecruiterType>(
    RecruiterType.INDIVIDUAL
  );
  const [documentRequirements, setDocumentRequirements] = useState<
    DocumentRequirement[]
  >([]);
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([]);
  const [verification, setVerification] =
    useState<RecruiterVerification | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationData();
  }, []);

  const loadVerificationData = async () => {
    try {
      setLoading(true);

      // First, get the user's profile to determine their recruiter type
      // If this fails with 401, user is not authenticated
      const profile = await getMyProfile();
      if (profile?.type) {
        setRecruiterType(profile.type);
      }

      // Then get verification data
      const verificationData = await getMyVerification();
      if (verificationData) {
        setVerification(verificationData);
        setCompanyName(verificationData.companyName || "");
        setCompanyAddress(verificationData.companyAddress || "");
        setState(verificationData.state || "");
        setCity(verificationData.city || "");
        setCompanySize(verificationData.companySize || "");
        setSocialOrWebsiteUrl(verificationData.socialOrWebsiteUrl || "");
      }

      // Load document requirements
      await loadDocumentRequirements();
    } catch (err: any) {
      console.error("Failed to load verification data:", err);

      // Check if it's an authentication error (401 or 403)
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        // User is not authenticated, redirect to login
        toastError("Please login to access this page");
        router.push("/auth/employer/login");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentRequirements = async () => {
    try {
      const requirements = await getDocumentRequirements();
      setDocumentRequirements(requirements);

      // Initialize document uploads
      const uploads: DocumentUpload[] = requirements.map((req) => ({
        documentType: req.documentType,
        file: null,
        documentNumber: "",
        uploaded: false,
        uploading: false,
      }));

      // Mark already uploaded documents
      if (verification?.documents) {
        verification.documents.forEach((doc) => {
          const upload = uploads.find(
            (u) => u.documentType === doc.documentType
          );
          if (upload) {
            upload.uploaded = true;
            upload.documentNumber = doc.documentNumber || "";
          }
        });
      }

      setDocumentUploads(uploads);
    } catch (err) {
      console.error("Failed to load document requirements:", err);
      toastError("Failed to load document requirements");
    }
  };

  const handleFileChange = (
    documentType: RecruiterDocumentType,
    file: File | null
  ) => {
    setDocumentUploads((prev) =>
      prev.map((upload) =>
        upload.documentType === documentType ? { ...upload, file } : upload
      )
    );
  };

  const handleDocumentNumberChange = (
    documentType: RecruiterDocumentType,
    documentNumber: string
  ) => {
    setDocumentUploads((prev) =>
      prev.map((upload) =>
        upload.documentType === documentType
          ? { ...upload, documentNumber }
          : upload
      )
    );
  };

  const uploadDocument = async (upload: DocumentUpload) => {
    if (!upload.file) return;

    setDocumentUploads((prev) =>
      prev.map((u) =>
        u.documentType === upload.documentType ? { ...u, uploading: true } : u
      )
    );

    try {
      const result = await uploadVerificationDocument(
        {
          documentType: upload.documentType,
          documentNumber: upload.documentNumber,
        },
        upload.file
      );

      setDocumentUploads((prev) =>
        prev.map((u) =>
          u.documentType === upload.documentType
            ? { ...u, uploaded: true, uploading: false, file: null }
            : u
        )
      );

      toastSuccess(`${upload.documentType} uploaded successfully`);

      // Check if auto-verification happened
      if (result.autoVerificationResult?.verified) {
        toastSuccess(result.autoVerificationResult.message);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Upload failed";
      toastError(errorMessage);

      setDocumentUploads((prev) =>
        prev.map((u) =>
          u.documentType === upload.documentType
            ? { ...u, uploading: false }
            : u
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Update verification info
      const verificationDto: UpdateVerificationInfoDto = {
        companyName: companyName.trim(),
        companyAddress: companyAddress.trim(),
        state: state.trim(),
        city: city.trim(),
        companySize: companySize.trim(),
        socialOrWebsiteUrl: socialOrWebsiteUrl.trim(),
      };

      await updateVerificationInfo(verificationDto);

      // Upload pending documents
      const pendingUploads = documentUploads.filter(
        (u) => u.file && !u.uploaded
      );
      for (const upload of pendingUploads) {
        await uploadDocument(upload);
      }

      // Check verification status
      const eligibility = await checkAutoVerificationEligibility();

      if (eligibility.canAutoVerify) {
        toastSuccess("Profile completed and verified successfully!");
        router.push("/dashboard"); // Redirect to main dashboard
      } else {
        toastInfo(
          "Profile saved. Verification pending for: " +
            eligibility.missingMandatoryDocuments.join(", ")
        );
        router.push("/auth/employer/profile/companyProfile");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to save profile";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getDocumentDisplayName = (docType: RecruiterDocumentType): string => {
    const requirement = documentRequirements.find(
      (req) => req.documentType === docType
    );
    return requirement?.description || docType.replace(/_/g, " ");
  };

  const requiresDocumentNumber = (docType: RecruiterDocumentType): boolean => {
    return [
      RecruiterDocumentType.NATIONAL_ID,
      RecruiterDocumentType.INTERNATIONAL_PASSPORT,
      RecruiterDocumentType.TAX_IDENTIFICATION,
      RecruiterDocumentType.CERTIFICATE_OF_BUSINESS_REGISTRATION,
      RecruiterDocumentType.CERTIFICATE_OF_INCORPORATION,
    ].includes(docType);
  };

  // Prepare state options
  const stateOptions = statesAndCities.map((stateData) => ({
    value: stateData.name,
    label: stateData.name,
  }));

  // Prepare city options based on selected state
  const cityOptions =
    statesAndCities
      .find((s) => s.name === state)
      ?.cities.map((cityName) => ({
        value: cityName,
        label: cityName,
      })) || [];

  // Company size options
  const companySizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "10-50", label: "10-50 employees" },
    { value: "50-100", label: "50-100 employees" },
    { value: "100-500", label: "100-500 employees" },
    { value: "500+", label: "500+ employees" },
  ];

  if (loading) {
    return (
      <AuthPageLayout
        heading="Loading..."
        subtext="Please wait while we load your profile"
        message={<div className="text-center">Loading...</div>}
      />
    );
  }

  return (
    <AuthPageLayout
      heading="Complete Your Employer Profile"
      subtext="Complete your profile and upload required documents to start hiring top talent"
      message={
        <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
          {/* Account Type Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">
                Account Type:
              </span>
              <span className="text-sm text-blue-700 font-semibold">
                {recruiterType || "Loading..."}
                {recruiterType === RecruiterType.INDIVIDUAL &&
                  " (Personal recruiting)"}
                {recruiterType === RecruiterType.SME &&
                  " (Small & Medium Enterprise)"}
                {recruiterType === RecruiterType.ORGANIZATION &&
                  " (Company/Corporate recruiting)"}
              </span>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company/Business Name"
              placeholder="Enter company name"
              iconLeft={<Building2 size={16} />}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            <SearchableSelect
              label="Company Size"
              options={companySizeOptions}
              value={companySize}
              onChange={setCompanySize}
              placeholder="Select company size..."
              icon={<Users size={16} />}
            />
          </div>

          <Input
            label="Business Address"
            placeholder="Enter street address"
            iconLeft={<MapPin size={16} />}
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="State"
              options={stateOptions}
              value={state}
              onChange={(value) => {
                setState(value);
                setCity(""); // Reset city when state changes
              }}
              placeholder="Search and select state..."
              required
              icon={<MapPin size={16} />}
              emptyMessage="No state found."
            />

            <SearchableSelect
              label="City/LGA"
              options={cityOptions}
              value={city}
              onChange={setCity}
              placeholder={
                state ? "Search and select city/LGA..." : "Select state first"
              }
              required
              disabled={!state}
              icon={<MapPin size={16} />}
              emptyMessage="No city/LGA found."
            />
          </div>

          <Input
            label="Website or Social Media URL"
            placeholder="https://company.com or social media link"
            iconLeft={<Globe size={16} />}
            value={socialOrWebsiteUrl}
            onChange={(e) => setSocialOrWebsiteUrl(e.target.value)}
          />

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Required Documents
            </h3>
            <p className="text-sm text-slate-600">
              Upload the following documents to verify your account. Mandatory
              documents are marked with *.
            </p>

            {documentUploads.map((upload) => {
              const requirement = documentRequirements.find(
                (req) => req.documentType === upload.documentType
              );
              if (!requirement) return null;

              return (
                <div
                  key={upload.documentType}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {getDocumentDisplayName(upload.documentType)}
                        {requirement.mandatory && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {requirement.purpose}
                      </p>
                    </div>
                    {upload.uploaded && (
                      <span className="text-green-600 text-sm font-medium">
                        ✓ Uploaded
                      </span>
                    )}
                  </div>

                  {requiresDocumentNumber(upload.documentType) && (
                    <Input
                      label="Document Number"
                      placeholder="Enter document number"
                      value={upload.documentNumber}
                      onChange={(e) =>
                        handleDocumentNumberChange(
                          upload.documentType,
                          e.target.value
                        )
                      }
                      disabled={upload.uploaded}
                    />
                  )}

                  {!upload.uploaded && (
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            upload.documentType,
                            e.target.files?.[0] || null
                          )
                        }
                        className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {upload.file && (
                        <Button
                          type="button"
                          onClick={() => uploadDocument(upload)}
                          disabled={upload.uploading}
                          className="px-4 py-2"
                        >
                          {upload.uploading ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full py-4 text-base font-medium"
            disabled={submitting}
          >
            {submitting ? "Saving Profile..." : "Save & Continue"}
          </Button>
        </form>
      }
    />
  );
};

// This page is protected by middleware.ts
// No need for client-side protection wrapper
export default ProfilePage;
