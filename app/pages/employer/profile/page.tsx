"use client";

import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import threedots from "@/app/assets/threedots.svg";
import locationPin from "@/app/assets/locationPin.svg";
import documentIcon from "@/app/assets/documentIcon.svg";
import { toastSuccess, toastError } from "@/app/lib/toast";
import Loading from "@/app/loading";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import { useAuth } from "@/app/lib/auth-context";
import { UserRole, VerificationStatus } from "@/app/lib/enums";
import {
  empGetProfile,
  empUpdateProfile,
  empGetCompanyLogo,
  empUploadCompanyLogo,
} from "@/app/api/auth-employer.api";
import { updateVerificationInfo } from "@/app/api/employer-verification.api";
import type {
  EmployerProfile,
  EmployerVerification as ProfileVerification,
} from "@/app/lib/profile-completion";
import {
  EmployerType,
  type UpdateVerificationInfoDto,
} from "@/app/types/employer.type";
import { InlineEditable } from "@/app/pages/jobseeker/profile/components/InlineEditable";
import { EditModal } from "@/app/pages/jobseeker/profile/components/EditModal";
import { LocationEditor } from "@/app/pages/jobseeker/profile/components/LocationEditor";
import {
  SearchableSelect,
  type SelectOption,
} from "@/app/pages/components/SearchableSelect";
import {
  Mail,
  Phone,
  UserIcon,
  Globe,
  UsersIcon,
  Building,
} from "lucide-react";
import JobCard from "../../components/jobcard";
import statesAndCities from "@/app/lib/states-and-cities.json";

type VerificationDocument = ProfileVerification["documents"] extends Array<
  infer T
>
  ? T
  : never;

type VerificationShape = ProfileVerification & {
  documents?: Array<
    VerificationDocument & {
      verified?: boolean;
      document?: { fileName?: string };
    }
  >;
  rejectionReason?: string;
};

type ProfileShape = EmployerProfile & {
  address?: string;
  jobs?: unknown[];
  profilePictureId?: string;
  verification?: VerificationShape | null;
};

type EditableField =
  | "fullName"
  | "phoneNumber"
  | "address"
  | "type"
  | "companyName"
  | "companyAddress"
  | "companyLocation"
  | "companySize"
  | "social";

const cardBase =
  "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6";
const sectionTitle =
  "flex items-center justify-between mb-3 text-sm font-semibold text-slate-900";

const employerTypeOptions: SelectOption[] = [
  { value: EmployerType.INDIVIDUAL, label: "Individual Employer" },
  { value: EmployerType.SME, label: "Small / Medium Business" },
  { value: EmployerType.ORGANIZATION, label: "Organization / Agency" },
];

const companySizeOptions: SelectOption[] = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

const stateOptions: SelectOption[] = statesAndCities.map((stateData) => ({
  value: stateData.name,
  label: stateData.name,
}));

export default function EmployerProfilePage() {
  const { isLoading: authLoading } = useProtectedRoute({
    allowedRoles: [UserRole.EMPLOYER],
    requireAuth: true,
  });
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [verification, setVerification] = useState<VerificationShape | null>(
    null
  );
  const [profilePicture, setProfilePicture] = useState<{
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
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingFields, setEditingFields] = useState<
    Record<EditableField, boolean>
  >({
    fullName: false,
    phoneNumber: false,
    address: false,
    type: false,
    companyName: false,
    companyAddress: false,
    companyLocation: false,
    companySize: false,
    social: false,
  });

  const [savingStates, setSavingStates] = useState<
    Record<EditableField, boolean>
  >({
    fullName: false,
    phoneNumber: false,
    address: false,
    type: false,
    companyName: false,
    companyAddress: false,
    companyLocation: false,
    companySize: false,
    social: false,
  });

  const [mobileModal, setMobileModal] = useState<{
    isOpen: boolean;
    title: string;
    content: ReactNode;
  }>({
    isOpen: false,
    title: "",
    content: null,
  });

  const showMobileModal = useCallback((title: string, content: ReactNode) => {
    setMobileModal({ isOpen: true, title, content });
  }, []);

  const closeMobileModal = () => {
    setMobileModal({ isOpen: false, title: "", content: null });
  };

  const toggleFieldEdit = (field: EditableField) => {
    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const normalizedEmployerType = useMemo<EmployerType>(() => {
    const rawType = profile?.type;
    if (!rawType) return EmployerType.INDIVIDUAL;
    const match = (Object.values(EmployerType) as string[]).find(
      (type) => type.toLowerCase() === rawType.toLowerCase()
    );
    return (match as EmployerType) || EmployerType.INDIVIDUAL;
  }, [profile?.type]);

  const isIndividual = normalizedEmployerType === EmployerType.INDIVIDUAL;

  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Employer";

  const displayLocation = useMemo(() => {
    if (verification?.city && verification?.state) {
      return `${verification.city}, ${verification.state}`;
    }
    if (profile?.address) {
      return profile.address;
    }
    return "Location not specified";
  }, [profile?.address, verification?.city, verification?.state]);

  const jobsPosted =
    profile?.jobs && Array.isArray(profile.jobs) ? profile.jobs.length : 0;

  const applyVerificationUpdate = async (
    field: EditableField,
    dto: Partial<UpdateVerificationInfoDto>,
    successMessage: string
  ) => {
    setSavingStates((prev) => ({ ...prev, [field]: true }));
    try {
      const updated = (await updateVerificationInfo(
        dto
      )) as unknown as VerificationShape;
      setVerification(updated);
      setProfile((prev) => (prev ? { ...prev, verification: updated } : prev));
      toastSuccess(successMessage);
      setEditingFields((prev) => ({ ...prev, [field]: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to update verification info"
      );
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, [field]: false }));
    }
  };

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = (await empGetProfile()) as ProfileShape;
      setProfile(profileData);
      setVerification((profileData.verification as VerificationShape) || null);

      if (profileData.profilePictureId) {
        try {
          const logo = await empGetCompanyLogo();
          setProfilePicture(logo);
        } catch (logoError) {
          console.warn("Unable to load company logo", logoError);
        }
      } else {
        setProfilePicture(null);
      }
    } catch (err: any) {
      console.error("Failed to load employer profile", err);
      setError(err?.response?.data?.message || "Unable to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      void loadProfile();
    }
  }, [authLoading, isAuthenticated, loadProfile]);

  const saveFullName = async (value: string) => {
    if (!value.trim().includes(" ")) {
      toastError("Please include a space between first and last name");
      return;
    }
    const [firstName, ...rest] = value.trim().split(/\s+/);
    const lastName = rest.join(" ");
    setSavingStates((prev) => ({ ...prev, fullName: true }));
    try {
      await empUpdateProfile({ firstName, lastName });
      setProfile((prev) => (prev ? { ...prev, firstName, lastName } : prev));
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
      setProfile((prev) => (prev ? { ...prev, phoneNumber: value } : prev));
      toastSuccess("Phone number updated");
      setEditingFields((prev) => ({ ...prev, phoneNumber: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update phone");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, phoneNumber: false }));
    }
  };

  const saveAddress = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, address: true }));
    try {
      await empUpdateProfile({ address: value });
      setProfile((prev) => (prev ? { ...prev, address: value } : prev));
      toastSuccess("Address updated");
      setEditingFields((prev) => ({ ...prev, address: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update address");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, address: false }));
    }
  };

  const saveEmployerType = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, type: true }));
    try {
      await empUpdateProfile({ type: value as EmployerType });
      setProfile((prev) =>
        prev ? { ...prev, type: value as ProfileShape["type"] } : prev
      );
      toastSuccess("Account type updated");
      setEditingFields((prev) => ({ ...prev, type: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to update account type"
      );
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, type: false }));
    }
  };

  const saveCompanyName = (value: string) =>
    applyVerificationUpdate(
      "companyName",
      { companyName: value },
      "Company name updated"
    );

  const saveCompanyAddress = (value: string) =>
    applyVerificationUpdate(
      "companyAddress",
      { companyAddress: value },
      "Business address updated"
    );

  const saveCompanySize = (value: string) =>
    applyVerificationUpdate(
      "companySize",
      { companySize: value },
      "Company size updated"
    );

  const saveSocialLink = (value: string) =>
    applyVerificationUpdate(
      "social",
      { socialOrWebsiteUrl: value },
      "Link updated"
    );

  const saveCompanyLocation = async (state: string, city: string) => {
    await applyVerificationUpdate(
      "companyLocation",
      { state, city },
      "Company location updated"
    );
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toastError("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toastError("Image size must be less than 5MB");
      return;
    }
    try {
      await empUploadCompanyLogo(file);
      const logo = await empGetCompanyLogo();
      setProfilePicture(logo);
      toastSuccess("Logo updated successfully");
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to upload logo");
    }
  };

  const renderLocationInput = (
    state: string,
    city: string,
    onStateChange: (value: string) => void,
    onCityChange: (value: string) => void
  ) => {
    const cities =
      statesAndCities
        .find((s) => s.name === state)
        ?.cities.map((cityName) => ({ value: cityName, label: cityName })) ||
      [];
    return (
      <div className="space-y-3">
        <SearchableSelect
          options={stateOptions}
          value={state}
          onChange={(value) => {
            onStateChange(value);
            onCityChange("");
          }}
          label="State"
          placeholder="Select state"
        />
        {state && (
          <SearchableSelect
            options={cities}
            value={city}
            onChange={onCityChange}
            label="City / LGA"
            placeholder="Select city"
          />
        )}
      </div>
    );
  };

  const renderVerificationStatus = (status?: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.APPROVED:
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case VerificationStatus.PENDING:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        );
      case VerificationStatus.REJECTED:
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

  if (authLoading || isLoading) {
    return <Loading text="Loading employer profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-md">
          <p className="text-slate-700 mb-4">
            {error || "We could not load your profile."}
          </p>
          <button
            onClick={() => void loadProfile()}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <EditModal
        isOpen={mobileModal.isOpen}
        onClose={closeMobileModal}
        title={mobileModal.title}
      >
        {mobileModal.content}
      </EditModal>

      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 pb-12 md:pb-24 pt-10 mb-10 md:px-10 md:mb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 opacity-20">
          <div className="h-full bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
        </div>
        <header className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex text-white gap-4 md:gap-6">
            <div className="relative group">
              <div className="h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-4 border-white/70 bg-slate-200">
                {profilePicture?.signedUrl ? (
                  <Image
                    src={profilePicture.signedUrl}
                    alt={fullName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 text-lg font-semibold">
                    {profile.companyName?.charAt(0) ||
                      profile.firstName?.charAt(0) ||
                      "E"}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                />
                {profilePicture?.signedUrl ? "Change Logo" : "Upload Logo"}
              </label>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {fullName}
                </h1>
                {renderVerificationStatus(verification?.status)}
              </div>
              <p className="text-slate-200 text-sm mb-1">
                {isIndividual
                  ? "Individual employer account"
                  : verification?.companyName ||
                    profile.companyName ||
                    "Company account"}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Image
                  src={locationPin}
                  alt="location"
                  width={14}
                  height={14}
                />
                <span>{displayLocation}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button className="rounded-lg border border-white/60 px-4 py-2 text-xs font-medium text-white hover:bg-white/10">
              Share Profile
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 hover:bg-white"
              aria-label="More options"
            >
              <Image src={threedots} alt="menu" />
            </button>
          </div>
        </header>
      </div>

      <div className="px-4 md:px-8 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">
                  {isIndividual ? "About this Employer" : "Company Overview"}
                </span>
              </div>
              <div className="space-y-6">
                {!isIndividual && (
                  <>
                    <InlineEditable
                      value={verification?.companyName || ""}
                      onSave={saveCompanyName}
                      renderInput={(value, onChange) => (
                        <input
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          placeholder="Registered company name"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                        />
                      )}
                      isEditing={editingFields.companyName}
                      onEditToggle={() => toggleFieldEdit("companyName")}
                      label="Company Name"
                      placeholder="Add company name"
                      showMobileModal={showMobileModal}
                      mobileModalTitle="Edit Company Name"
                    />
                    <InlineEditable
                      value={verification?.companyAddress || ""}
                      onSave={saveCompanyAddress}
                      renderInput={(value, onChange) => (
                        <textarea
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          rows={3}
                          placeholder="Business address"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm resize-none"
                        />
                      )}
                      isEditing={editingFields.companyAddress}
                      onEditToggle={() => toggleFieldEdit("companyAddress")}
                      label="Business Address"
                      placeholder="Add business address"
                      showMobileModal={showMobileModal}
                      mobileModalTitle="Edit Business Address"
                    />
                    <LocationEditor
                      state={verification?.state}
                      city={verification?.city}
                      preferredLocation={profile.address}
                      onSave={saveCompanyLocation}
                      renderInput={renderLocationInput}
                      isEditing={editingFields.companyLocation}
                      onEditToggle={() => toggleFieldEdit("companyLocation")}
                      showMobileModal={showMobileModal}
                      closeMobileModal={closeMobileModal}
                    />
                    <InlineEditable
                      value={verification?.companySize || ""}
                      onSave={saveCompanySize}
                      renderInput={(value, onChange) => (
                        <SearchableSelect
                          options={companySizeOptions}
                          value={value}
                          onChange={onChange}
                          placeholder="Select company size"
                        />
                      )}
                      isEditing={editingFields.companySize}
                      onEditToggle={() => toggleFieldEdit("companySize")}
                      label="Company Size"
                      placeholder="Select company size"
                      showMobileModal={showMobileModal}
                      mobileModalTitle="Update Company Size"
                    />
                  </>
                )}
                <InlineEditable
                  value={verification?.socialOrWebsiteUrl || ""}
                  onSave={saveSocialLink}
                  renderInput={(value, onChange) => (
                    <input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={
                        isIndividual
                          ? "Portfolio or social link"
                          : "Company website or social link"
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                    />
                  )}
                  isEditing={editingFields.social}
                  onEditToggle={() => toggleFieldEdit("social")}
                  label={
                    isIndividual
                      ? "Portfolio / Social Link"
                      : "Website / Social Link"
                  }
                  placeholder="Add a link"
                  showMobileModal={showMobileModal}
                  mobileModalTitle="Edit Link"
                />
              </div>
            </section>

            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">Verification</span>
              </div>
              <div className="space-y-5 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Status</p>
                    <div className="mt-1">
                      {renderVerificationStatus(verification?.status)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-400">
                      Documents
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {verification?.documents?.length || 0}
                    </p>
                  </div>
                </div>
                {verification?.rejectionReason && (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-800">
                    <p className="font-semibold text-sm">Needs attention</p>
                    <p className="text-xs mt-1">
                      {verification.rejectionReason}
                    </p>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {verification?.documents &&
                  verification.documents.length > 0 ? (
                    verification.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
                      >
                        <Image
                          src={documentIcon}
                          alt="document"
                          width={20}
                          height={20}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {doc.documentType?.replace(/_/g, " ") ||
                              doc.type?.replace(/_/g, " ") ||
                              "Document"}
                          </p>
                          {doc.documentNumber && (
                            <p className="text-xs text-slate-500">
                              Ref: {doc.documentNumber}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            (doc as any).verified
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-amber-600 bg-amber-50"
                          } px-2.5 py-0.5 rounded-full`}
                        >
                          {(doc as any).verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No verification documents uploaded yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">
                  Active Job Listings
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <JobCard
                  location="Surulere, Lagos"
                  verified
                  timePosted="1 day ago"
                  title="Childminder / Nanny"
                  description="We need a caring and patient nanny for our 2-year-old son while we are at work."
                  workType="On-site"
                  schedule="Monday – Friday (7am – 5pm)"
                  salary="₦35,000 / month"
                />
                <JobCard
                  location="Lekki, Lagos"
                  verified
                  timePosted="4 days ago"
                  title="Office Administrator"
                  description="Coordinate office operations and support our field recruiters."
                  workType="Hybrid"
                  schedule="Monday – Friday"
                  salary="₦200,000 / month"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">Contact Details</span>
              </div>
              <div className="space-y-4">
                <InlineEditable
                  value={fullName}
                  onSave={saveFullName}
                  renderInput={(value, onChange) => (
                    <input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                    />
                  )}
                  isEditing={editingFields.fullName}
                  onEditToggle={() => toggleFieldEdit("fullName")}
                  label="Primary Contact"
                  placeholder="Add name"
                  showMobileModal={showMobileModal}
                  mobileModalTitle="Edit Name"
                />
                <InlineEditable
                  value={profile.phoneNumber || ""}
                  onSave={savePhoneNumber}
                  renderInput={(value, onChange) => (
                    <input
                      type="tel"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="+234 000 000 0000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                    />
                  )}
                  isEditing={editingFields.phoneNumber}
                  onEditToggle={() => toggleFieldEdit("phoneNumber")}
                  label="Phone"
                  placeholder="Add phone number"
                  showMobileModal={showMobileModal}
                  mobileModalTitle="Edit Phone Number"
                />
                <div className="group relative">
                  <p className="text-xs font-semibold uppercase text-slate-400 mb-1">
                    Email
                  </p>
                  <p className="text-slate-800 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {profile.email}
                  </p>
                  <p className="text-xs text-slate-500">
                    Email updates are handled by JobStack support.
                  </p>
                </div>
                <InlineEditable
                  value={profile.address || ""}
                  onSave={saveAddress}
                  renderInput={(value, onChange) => (
                    <textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      rows={3}
                      placeholder="Mailing address"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm resize-none"
                    />
                  )}
                  isEditing={editingFields.address}
                  onEditToggle={() => toggleFieldEdit("address")}
                  label="Mailing Address"
                  placeholder="Add mailing address"
                  showMobileModal={showMobileModal}
                  mobileModalTitle="Edit Mailing Address"
                />
              </div>
            </section>

            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">Account Type</span>
              </div>
              <InlineEditable
                value={normalizedEmployerType}
                onSave={saveEmployerType}
                renderInput={(value, onChange) => (
                  <SearchableSelect
                    options={employerTypeOptions}
                    value={value}
                    onChange={onChange}
                    placeholder="Select employer type"
                  />
                )}
                isEditing={editingFields.type}
                onEditToggle={() => toggleFieldEdit("type")}
                label="Employer Category"
                placeholder="Select employer type"
                showMobileModal={showMobileModal}
                mobileModalTitle="Change Account Type"
              />
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Account type determines required verification info and
                documents.
              </div>
            </section>

            <section className={cardBase}>
              <div className={sectionTitle}>
                <span className="text-xl font-semibold">Employer Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Total Jobs Posted</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {jobsPosted}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Documents Uploaded</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {verification?.documents?.length ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Verification Status</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {verification?.status || "NOT_STARTED"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Account Type</p>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    {normalizedEmployerType}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
