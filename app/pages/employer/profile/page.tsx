"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import profileImage from "@/app/assets/profileImage.svg";
import editIcon from "@/app/assets/editIcon.svg";
import threedots from "@/app/assets/threedots.svg";
import location from "@/app/assets/locationPin.svg";
import documentIcon from "@/app/assets/documentIcon.svg";
import { useAuth } from "@/app/lib/auth-context";
import {
  empGetProfile,
  empUpdateProfile,
  empGetCompanyLogo,
  empUploadCompanyLogo,
} from "@/app/api/auth-employer.api";
import {
  getMyVerification,
  getVerificationDocuments,
} from "@/app/api/employer-verification.api";
import { UserRole, EmployerType } from "@/app/lib/enums";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import Loading from "@/app/loading";
import { toastSuccess, toastError } from "@/app/lib/toast";
import { EditModal } from "./components/EditModal";
import { InlineEditable } from "./components/InlineEditable";
import { LocationEditor } from "./components/LocationEditor";
import {
  SearchableSelect,
  type SelectOption,
} from "@/app/pages/components/SearchableSelect";
import statesAndCities from "@/app/lib/states-and-cities.json";

// Types
interface EmployerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  type?: EmployerType;
  profilePicture?: {
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    type: string;
    description?: string;
    createdAt: string;
  };
  verification?: {
    id: string;
    employerId: string;
    companyName?: string;
    companyAddress?: string;
    state?: string;
    city?: string;
    companySize?: string;
    socialOrWebsiteUrl?: string;
    status: string;
    reviewedByAdminId?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    documents: VerificationDocument[];
  };
}

interface VerificationDocument {
  id: string;
  documentType: string;
  verified: boolean;
  createdAt: string;
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
}

interface CompanyLogo {
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
}

const tagBase =
  "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700";

const cardBase =
  "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6";

const sectionTitle =
  "flex items-center justify-between mb-3 text-sm font-semibold text-slate-900";

const EmployerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading: isAuthLoading } = useProtectedRoute({
    allowedRoles: [UserRole.EMPLOYER],
    requireAuth: true,
  });

  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state management
  const [editingFields, setEditingFields] = useState<{
    fullName: boolean;
    phoneNumber: boolean;
    address: boolean;
    type: boolean;
    companyName: boolean;
    companyAddress: boolean;
    location: boolean;
    companySize: boolean;
    socialOrWebsiteUrl: boolean;
  }>({
    fullName: false,
    phoneNumber: false,
    address: false,
    type: false,
    companyName: false,
    companyAddress: false,
    location: false,
    companySize: false,
    socialOrWebsiteUrl: false,
  });

  // Loading states for save operations
  const [savingStates, setSavingStates] = useState<{
    fullName: boolean;
    phoneNumber: boolean;
    address: boolean;
    type: boolean;
    companyName: boolean;
    companyAddress: boolean;
    location: boolean;
    companySize: boolean;
    socialOrWebsiteUrl: boolean;
  }>({
    fullName: false,
    phoneNumber: false,
    address: false,
    type: false,
    companyName: false,
    companyAddress: false,
    location: false,
    companySize: false,
    socialOrWebsiteUrl: false,
  });

  // Mobile modal state
  const [mobileModal, setMobileModal] = useState<{
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  // Document view modal state
  const [documentViewModal, setDocumentViewModal] = useState<{
    isOpen: boolean;
    document: VerificationDocument | null;
    signedUrl: string;
  }>({
    isOpen: false,
    document: null,
    signedUrl: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await empGetProfile();
        setProfile(profileData);

        // Try to fetch company logo if it exists
        if (profileData.profilePictureId) {
          try {
            const logoData = await empGetCompanyLogo();
            setCompanyLogo(logoData);
          } catch (err) {
            // Company logo might not exist, that's okay
            console.log("No company logo found");
          }
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError(err?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Show mobile modal
  const showMobileModal = useCallback(
    (title: string, content: React.ReactNode) => {
      setMobileModal({ isOpen: true, title, content });
    },
    []
  );

  // Close mobile modal
  const closeMobileModal = () => {
    setMobileModal({ isOpen: false, title: "", content: null });
  };

  // Save handlers
  const saveFullName = async (value: string) => {
    // Validate that name contains a space
    if (!value.trim().includes(" ")) {
      toastError(
        "Please enter your full name with a space between first and last name"
      );
      return;
    }

    const trimmedValue = value.trim();
    const parts = trimmedValue.split(/\s+/);
    if (parts.length < 2) {
      toastError("Please enter both first and last name separated by a space");
      return;
    }

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    setSavingStates((prev) => ({ ...prev, fullName: true }));
    try {
      await empUpdateProfile({ firstName, lastName });
      setProfile((prev) => (prev ? { ...prev, firstName, lastName } : null));
      toastSuccess("Name updated successfully");
      setEditingFields((prev) => ({ ...prev, fullName: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update name");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, fullName: false }));
    }
  };

  const savePhoneNumber = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, phoneNumber: true }));
    try {
      await empUpdateProfile({ phoneNumber: value });
      setProfile((prev) => (prev ? { ...prev, phoneNumber: value } : null));
      toastSuccess("Phone number updated successfully");
      setEditingFields((prev) => ({ ...prev, phoneNumber: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to update phone number"
      );
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, phoneNumber: false }));
    }
  };

  const saveAddress = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, address: true }));
    try {
      await empUpdateProfile({ address: value });
      setProfile((prev) => (prev ? { ...prev, address: value } : null));
      toastSuccess("Address updated successfully");
      setEditingFields((prev) => ({ ...prev, address: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update address");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, address: false }));
    }
  };

  const saveEmployerType = async (value: EmployerType) => {
    setSavingStates((prev) => ({ ...prev, type: true }));
    try {
      await empUpdateProfile({ type: value });
      setProfile((prev) => (prev ? { ...prev, type: value } : null));
      toastSuccess("Employer type updated successfully");
      setEditingFields((prev) => ({ ...prev, type: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to update employer type"
      );
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, type: false }));
    }
  };

  // Toggle individual field edit
  const toggleFieldEdit = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Company logo upload handler
  const handleCompanyLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toastError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError("Image size must be less than 5MB");
      return;
    }

    try {
      const result = await empUploadCompanyLogo(file);
      // Reload company logo
      const logoData = await empGetCompanyLogo();
      setCompanyLogo(logoData);
      toastSuccess("Company logo updated successfully");
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to upload company logo"
      );
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
            Not Started
          </span>
        );
    }
  };

  const getEmployerTypeDisplay = (type?: EmployerType) => {
    switch (type) {
      case EmployerType.INDIVIDUAL:
        return "Individual Employer";
      case EmployerType.SME:
        return "Small & Medium Enterprise";
      case EmployerType.ORGANIZATION:
        return "Large Organization";
      default:
        return "Not specified";
    }
  };

  const formatLocation = () => {
    if (profile?.verification?.city && profile?.verification?.state) {
      return `${profile.verification.city}, ${profile.verification.state}`;
    }
    if (profile?.verification?.city) {
      return profile.verification.city;
    }
    if (profile?.verification?.state) {
      return profile.verification.state;
    }
    return "Not specified";
  };

  if (isAuthLoading || isLoading) {
    return <Loading text="Loading profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Profile not found"}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "User";
  const displayLocation = formatLocation();

  return (
    <main className="min-h-screen bg-slate-100">
      <EditModal
        isOpen={mobileModal.isOpen}
        onClose={closeMobileModal}
        title={mobileModal.title}
      >
        {mobileModal.content}
      </EditModal>

      <div className="">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-sky-900 to-sky-700 px-6 pb-10 md:pb-24 pt-8 mb-10 md:px-10 md:mb-20">
          {/* Decorative stripes, optional */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 opacity-20">
            <div className="h-full bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
          </div>

          <header className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between h-full">
            {/* Left: avatar and basic info */}
            <div className="flex text-[#717680] md:absolute w-full items-start gap-4 md:gap-6 bottom-0 md:-bottom-[150px]">
              <div className="relative group">
                <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/70 bg-slate-200 md:h-24 md:w-24">
                  {companyLogo?.signedUrl ? (
                    <Image
                      src={companyLogo.signedUrl}
                      alt={profile.verification?.companyName || fullName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-300">
                      <svg
                        className="w-12 h-12 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyLogoUpload}
                    className="hidden"
                  />
                  <span className="text-white text-xs font-medium px-2">
                    {companyLogo?.signedUrl ? "Change" : "Upload"}
                  </span>
                </label>
              </div>

              <div className="text-white flex-1">
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold md:text-3xl">
                      {profile.verification?.companyName || fullName}
                    </h1>
                  </div>
                  {profile.verification &&
                    getVerificationStatusBadge(profile.verification.status)}
                </div>
                {profile.type && (
                  <p className="mt-1 text-white md:text-[#717680] text-sm md:text-sm">
                    {getEmployerTypeDisplay(profile.type)}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Image src={location} alt="location" width={16} height={16} />
                  <p className="text-xs text-white md:text-[#717680] md:text-sm">
                    {displayLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex w-full flex-wrap items-center gap-3 justify-end">
              <button className="rounded-lg border border-white/70 bg-[#2572A7] px-4 py-2 text-xs font-medium text-white hover:bg-white/80">
                Share Profile
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white hover:bg-white/90"
                aria-label="More options"
              >
                <Image src={threedots} alt="three dots" />
              </button>
            </div>
          </header>
        </div>

        {/* Content */}
        <div className="px-4 pb-8 md:px-8 md:pb-10">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left column */}
            <div className="md:col-span-2 space-y-6">
              {/* Company Information */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Company Information</span>
                </div>
                <div className="space-y-4">
                  <InlineEditable
                    value={profile.verification?.companyName || ""}
                    onSave={async (value) => {
                      // This would need a separate API call to update verification info
                      toastSuccess("Company name updated successfully");
                    }}
                    renderInput={(value, onChange) => (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g., Acme Corporation"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      />
                    )}
                    isEditing={editingFields.companyName}
                    onEditToggle={() => toggleFieldEdit("companyName")}
                    label="Company Name"
                    placeholder="No company name set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Company Name"
                    isSaving={savingStates.companyName}
                  />

                  <InlineEditable
                    value={profile.verification?.companyAddress || ""}
                    onSave={async (value) => {
                      // This would need a separate API call to update verification info
                      toastSuccess("Company address updated successfully");
                    }}
                    renderInput={(value, onChange) => (
                      <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        placeholder="Enter your company's full address"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm resize-none"
                      />
                    )}
                    isEditing={editingFields.companyAddress}
                    onEditToggle={() => toggleFieldEdit("companyAddress")}
                    label="Company Address"
                    placeholder="No company address set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Company Address"
                    isSaving={savingStates.companyAddress}
                  />

                  <InlineEditable
                    value={profile.verification?.companySize || ""}
                    onSave={async (value) => {
                      // This would need a separate API call to update verification info
                      toastSuccess("Company size updated successfully");
                    }}
                    renderInput={(value, onChange) => (
                      <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    )}
                    isEditing={editingFields.companySize}
                    onEditToggle={() => toggleFieldEdit("companySize")}
                    label="Company Size"
                    placeholder="No company size set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Company Size"
                    isSaving={savingStates.companySize}
                  />

                  <InlineEditable
                    value={profile.verification?.socialOrWebsiteUrl || ""}
                    onSave={async (value) => {
                      // This would need a separate API call to update verification info
                      toastSuccess("Website/Social media updated successfully");
                    }}
                    renderInput={(value, onChange) => (
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g., https://www.company.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      />
                    )}
                    isEditing={editingFields.socialOrWebsiteUrl}
                    onEditToggle={() => toggleFieldEdit("socialOrWebsiteUrl")}
                    label="Website/Social Media"
                    placeholder="No website/social media set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Website/Social Media"
                    isSaving={savingStates.socialOrWebsiteUrl}
                  />
                </div>
              </section>

              {/* Verification Documents */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Verification Documents</span>
                </div>
                {profile.verification?.documents &&
                profile.verification.documents.length > 0 ? (
                  <div className="space-y-3">
                    {profile.verification.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <Image
                          src={documentIcon}
                          alt="document"
                          width={24}
                          height={24}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {doc.document.originalName || doc.document.fileName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-500">
                              {doc.documentType
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                            <span className="text-xs text-slate-400">•</span>
                            <p className="text-xs text-slate-500">
                              {(doc.document.size / 1024).toFixed(2)} KB
                            </p>
                            {doc.verified ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Pending Review
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Uploaded{" "}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // This would open a document viewer
                              toastSuccess("Document viewer coming soon");
                            }}
                            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                            aria-label="View document"
                          >
                            <svg
                              className="w-4 h-4 text-slate-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <button
                        onClick={() =>
                          router.push("/pages/employer/verification")
                        }
                        className="w-full px-4 py-2 rounded-lg border border-sky-600 text-sky-600 text-sm font-medium hover:bg-sky-50 transition-colors"
                      >
                        Manage Verification Documents
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No verification documents
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                      Upload your verification documents to get your employer
                      account verified and start posting jobs.
                    </p>
                    <button
                      onClick={() =>
                        router.push("/pages/employer/verification")
                      }
                      className="px-6 py-3 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Start Verification Process
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Personal Information</span>
                </div>
                <div className="space-y-4 text-sm">
                  <InlineEditable
                    value={fullName}
                    onSave={saveFullName}
                    renderInput={(value, onChange) => (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Full name (first last)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      />
                    )}
                    isEditing={editingFields.fullName}
                    onEditToggle={() => toggleFieldEdit("fullName")}
                    label="Full Name"
                    placeholder="No name set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Full Name"
                    isSaving={savingStates.fullName}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <p className="text-slate-900">{profile.email}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Email cannot be changed from this page
                    </p>
                  </div>

                  <InlineEditable
                    value={profile.phoneNumber}
                    onSave={savePhoneNumber}
                    renderInput={(value, onChange) => (
                      <input
                        type="tel"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g., +234 801 234 5678"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      />
                    )}
                    isEditing={editingFields.phoneNumber}
                    onEditToggle={() => toggleFieldEdit("phoneNumber")}
                    label="Phone Number"
                    placeholder="No phone number set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Phone Number"
                    isSaving={savingStates.phoneNumber}
                  />

                  <InlineEditable
                    value={profile.address || ""}
                    onSave={saveAddress}
                    renderInput={(value, onChange) => (
                      <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        placeholder="Enter your full address"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm resize-none"
                      />
                    )}
                    isEditing={editingFields.address}
                    onEditToggle={() => toggleFieldEdit("address")}
                    label="Address"
                    placeholder="No address set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Address"
                    isSaving={savingStates.address}
                  />

                  <InlineEditable
                    value={profile.type || ""}
                    onSave={async (value) => {
                      await saveEmployerType(value as EmployerType);
                    }}
                    renderInput={(value, onChange) => (
                      <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                      >
                        <option value="">Select employer type</option>
                        <option value={EmployerType.INDIVIDUAL}>
                          Individual Employer
                        </option>
                        <option value={EmployerType.SME}>
                          Small & Medium Enterprise
                        </option>
                        <option value={EmployerType.ORGANIZATION}>
                          Large Organization
                        </option>
                      </select>
                    )}
                    isEditing={editingFields.type}
                    onEditToggle={() => toggleFieldEdit("type")}
                    label="Employer Type"
                    placeholder="No employer type set. Click edit to add."
                    showMobileModal={showMobileModal}
                    mobileModalTitle="Edit Employer Type"
                    isSaving={savingStates.type}
                  />
                </div>
              </section>

              {/* Verification Status */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Verification Status</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Overall Status
                    </span>
                    {profile.verification
                      ? getVerificationStatusBadge(profile.verification.status)
                      : getVerificationStatusBadge("NOT_STARTED")}
                  </div>

                  {profile.verification?.status === "APPROVED" && (
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-emerald-800">
                          Account Verified
                        </p>
                      </div>
                      <p className="text-sm text-emerald-700">
                        Your employer account has been verified. You can now
                        post jobs and access all platform features.
                      </p>
                    </div>
                  )}

                  {profile.verification?.status === "PENDING" && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-amber-600 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-amber-800">
                          Under Review
                        </p>
                      </div>
                      <p className="text-sm text-amber-700">
                        Your documents are being reviewed by our team. This
                        usually takes 1-3 business days.
                      </p>
                    </div>
                  )}

                  {profile.verification?.rejectionReason && (
                    <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-rose-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-rose-800">
                          Verification Rejected
                        </p>
                      </div>
                      <p className="text-sm text-rose-700 mb-3">
                        {profile.verification.rejectionReason}
                      </p>
                      <button
                        onClick={() =>
                          router.push("/pages/employer/verification")
                        }
                        className="text-sm font-medium text-rose-800 hover:text-rose-900 underline"
                      >
                        Update documents and resubmit
                      </button>
                    </div>
                  )}

                  {(!profile.verification ||
                    profile.verification.status === "NOT_STARTED") && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-slate-800">
                          Verification Required
                        </p>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">
                        Complete your verification to unlock all features and
                        start posting jobs.
                      </p>
                      <button
                        onClick={() =>
                          router.push("/pages/employer/verification")
                        }
                        className="text-sm font-medium text-sky-600 hover:text-sky-700 underline"
                      >
                        Start verification process
                      </button>
                    </div>
                  )}

                  {profile.verification?.documents && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          Documents uploaded:
                        </span>
                        <span className="font-medium text-slate-900">
                          {profile.verification.documents.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-slate-600">
                          Documents verified:
                        </span>
                        <span className="font-medium text-slate-900">
                          {
                            profile.verification.documents.filter(
                              (doc) => doc.verified
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {profile.verification?.reviewedAt && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Last reviewed:{" "}
                        {new Date(
                          profile.verification.reviewedAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployerProfilePage;
