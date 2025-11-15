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
  fetchJobSeekerProfile,
  type JobSeekerProfile,
} from "@/app/lib/profile-completion";
import {
  jsGetCvDocument,
  jsGetProfilePicture,
  jsUpdateProfile,
  jsUploadProfilePicture,
} from "@/app/api/auth-jobseeker.api";
import { getSkills, type Skill } from "@/app/api/skills.api";
import { ApprovalStatus, UserRole } from "@/app/lib/enums";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import Loading from "@/app/loading";
import { toastSuccess, toastError } from "@/app/lib/toast";
import { EditModal } from "./components/EditModal";
import { InlineEditable } from "./components/InlineEditable";
import { LocationEditor } from "./components/LocationEditor";
import { SalaryEditor } from "./components/SalaryEditor";
import statesAndCities from "@/app/lib/states-and-cities.json";

const tagBase =
  "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700";

const cardBase =
  "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6";

const sectionTitle =
  "flex items-center justify-between mb-3 text-sm font-semibold text-slate-900";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading: isAuthLoading } = useProtectedRoute({
    allowedRoles: [UserRole.JOB_SEEKER],
    requireAuth: true,
  });
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [cvDocument, setCvDocument] = useState<{
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

  // Edit state management
  const [editingFields, setEditingFields] = useState<{
    firstName: boolean;
    lastName: boolean;
    bio: boolean;
    location: boolean;
    salary: boolean;
    skills: boolean;
  }>({
    firstName: false,
    lastName: false,
    bio: false,
    location: false,
    salary: false,
    skills: false,
  });

  // Loading states for save operations
  const [savingStates, setSavingStates] = useState<{
    firstName: boolean;
    lastName: boolean;
    bio: boolean;
    location: boolean;
    salary: boolean;
    skills: boolean;
  }>({
    firstName: false,
    lastName: false,
    bio: false,
    location: false,
    salary: false,
    skills: false,
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

  // Skills state
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profileData = await fetchJobSeekerProfile();
        setProfile(profileData);

        // Try to fetch CV document if it exists
        if (profileData.cvDocumentId) {
          try {
            const cvData = await jsGetCvDocument();
            setCvDocument(cvData);
          } catch (err) {
            // CV might not exist, that's okay
            console.log("No CV document found");
          }
        }

        // Try to fetch profile picture if it exists
        if (profileData.profilePictureId) {
          try {
            const pictureData = await jsGetProfilePicture();
            setProfilePicture(pictureData);
          } catch (err) {
            // Profile picture might not exist, that's okay
            console.log("No profile picture found");
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

  // Load skills when editing skills
  useEffect(() => {
    if (editingFields.skills) {
      const loadSkills = async () => {
        try {
          const skills = await getSkills();
          setAvailableSkills(skills);
        } catch (err) {
          console.error("Error loading skills:", err);
        }
      };
      loadSkills();
    }
  }, [editingFields.skills]);

  // Initialize selected skills from profile
  useEffect(() => {
    if (profile?.userSkills) {
      setSelectedSkillIds(
        profile.userSkills.map((us) => us.skill?.id).filter(Boolean) as string[]
      );
    }
  }, [profile]);

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
  const saveFirstName = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, firstName: true }));
    try {
      await jsUpdateProfile({ firstName: value });
      setProfile((prev) => (prev ? { ...prev, firstName: value } : null));
      toastSuccess("First name updated successfully");
      setEditingFields((prev) => ({ ...prev, firstName: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update first name");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, firstName: false }));
    }
  };

  const saveLastName = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, lastName: true }));
    try {
      await jsUpdateProfile({ lastName: value });
      setProfile((prev) => (prev ? { ...prev, lastName: value } : null));
      toastSuccess("Last name updated successfully");
      setEditingFields((prev) => ({ ...prev, lastName: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update last name");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, lastName: false }));
    }
  };

  const saveBio = async (value: string) => {
    setSavingStates((prev) => ({ ...prev, bio: true }));
    try {
      await jsUpdateProfile({ brief: value });
      setProfile((prev) => (prev ? { ...prev, brief: value } : null));
      toastSuccess("Bio updated successfully");
      setEditingFields((prev) => ({ ...prev, bio: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update bio");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, bio: false }));
    }
  };

  const saveLocation = async (state: string, city: string) => {
    setSavingStates((prev) => ({ ...prev, location: true }));
    try {
      await jsUpdateProfile({ state, city });
      setProfile((prev) => (prev ? { ...prev, state, city } : null));
      toastSuccess("Location updated successfully");
      setEditingFields((prev) => ({ ...prev, location: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update location");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, location: false }));
    }
  };

  const saveSalary = async (
    min: number | undefined,
    max: number | undefined
  ) => {
    setSavingStates((prev) => ({ ...prev, salary: true }));
    try {
      await jsUpdateProfile({
        minExpectedSalary: min,
        maxExpectedSalary: max,
      });
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              minExpectedSalary: min,
              maxExpectedSalary: max,
            }
          : null
      );
      toastSuccess("Salary updated successfully");
      setEditingFields((prev) => ({ ...prev, salary: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update salary");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, salary: false }));
    }
  };

  const saveSkills = async () => {
    setSavingStates((prev) => ({ ...prev, skills: true }));
    try {
      await jsUpdateProfile({ skillIds: selectedSkillIds });
      const updatedProfile = await fetchJobSeekerProfile();
      setProfile(updatedProfile);
      setSelectedSkillIds(
        updatedProfile.userSkills?.map((us) => us.skill?.id).filter(Boolean) ||
          []
      );
      toastSuccess("Skills updated successfully");
      setEditingFields((prev) => ({ ...prev, skills: false }));
      closeMobileModal();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update skills");
      throw err;
    } finally {
      setSavingStates((prev) => ({ ...prev, skills: false }));
    }
  };

  // Toggle individual field edit
  const toggleFieldEdit = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Filter skills based on search
  const filteredSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  // Toggle skill selection
  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // Profile picture upload handler
  const handleProfilePictureUpload = async (
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
      const result = await jsUploadProfilePicture(file);
      // Reload profile picture
      const pictureData = await jsGetProfilePicture();
      setProfilePicture(pictureData);
      toastSuccess("Profile picture updated successfully");
    } catch (err: any) {
      toastError(
        err?.response?.data?.message || "Failed to upload profile picture"
      );
    }
  };

  const getApprovalStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case ApprovalStatus.PENDING:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case ApprovalStatus.REJECTED:
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

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) {
      return `₦${min.toLocaleString()} – ₦${max.toLocaleString()} / month`;
    }
    if (min) {
      return `₦${min.toLocaleString()}+ / month`;
    }
    if (max) {
      return `Up to ₦${max.toLocaleString()} / month`;
    }
    return "Not specified";
  };

  const formatLocation = () => {
    if (profile?.city && profile?.state) {
      return `${profile.city}, ${profile.state}`;
    }
    if (profile?.preferredLocation) {
      return profile.preferredLocation;
    }
    if (profile?.city) {
      return profile.city;
    }
    if (profile?.state) {
      return profile.state;
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

  // Location input renderer
  const renderLocationInput = (
    state: string,
    city: string,
    onStateChange: (state: string) => void,
    onCityChange: (city: string) => void
  ) => {
    const availableCities =
      statesAndCities.find((s) => s.name === state)?.cities || [];

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            State
          </label>
          <select
            value={state}
            onChange={(e) => {
              onStateChange(e.target.value);
              onCityChange("");
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
          >
            <option value="">Select state</option>
            {statesAndCities.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        {state && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              City
            </label>
            <select
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
            >
              <option value="">Select city</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  // Salary input renderer
  const renderSalaryInput = (
    min: number | undefined,
    max: number | undefined,
    onMinChange: (min: number | undefined) => void,
    onMaxChange: (max: number | undefined) => void
  ) => {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Minimum Salary (₦/month)
          </label>
          <input
            type="number"
            value={min || ""}
            onChange={(e) =>
              onMinChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g., 50000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Maximum Salary (₦/month)
          </label>
          <input
            type="number"
            value={max || ""}
            onChange={(e) =>
              onMaxChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="e.g., 200000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
          />
        </div>
      </div>
    );
  };

  // Skills input renderer
  const renderSkillsInput = () => {
    return (
      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={skillSearchQuery}
            onChange={(e) => setSkillSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm mb-3"
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredSkills.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No skills found
            </p>
          ) : (
            filteredSkills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSkillIds.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                  className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">{skill.name}</span>
              </label>
            ))
          )}
        </div>
        {selectedSkillIds.length > 0 && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">
              {selectedSkillIds.length} skill(s) selected
            </p>
          </div>
        )}
      </div>
    );
  };

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
                  {profilePicture?.signedUrl ? (
                    <Image
                      src={profilePicture.signedUrl}
                      alt={fullName}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <span className="text-white text-xs font-medium px-2">
                    {profilePicture?.signedUrl ? "Change" : "Upload"}
                  </span>
                </label>
              </div>

              <div className="text-white flex-1">
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    {editingFields.firstName ? (
                      <input
                        type="text"
                        defaultValue={profile.firstName}
                        onBlur={async (e) => {
                          if (e.target.value !== profile.firstName) {
                            await saveFirstName(e.target.value);
                          }
                          setEditingFields((prev) => ({
                            ...prev,
                            firstName: false,
                          }));
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            const value = e.currentTarget.value;
                            if (value !== profile.firstName) {
                              await saveFirstName(value);
                            }
                            setEditingFields((prev) => ({
                              ...prev,
                              firstName: false,
                            }));
                          }
                          if (e.key === "Escape") {
                            setEditingFields((prev) => ({
                              ...prev,
                              firstName: false,
                            }));
                          }
                        }}
                        className="text-2xl font-semibold md:text-3xl bg-white/90 text-slate-900 px-2 py-1 rounded border border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 w-32 md:w-40"
                        placeholder="First name"
                        autoFocus
                      />
                    ) : (
                      <h1 className="text-2xl font-semibold md:text-3xl">
                        {profile.firstName}
                      </h1>
                    )}
                    {!editingFields.firstName && (
                      <button
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            const modalContent = (
                              <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  defaultValue={profile.firstName}
                                  onBlur={async (e) => {
                                    if (e.target.value !== profile.firstName) {
                                      await saveFirstName(e.target.value);
                                    }
                                    closeMobileModal();
                                  }}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                                  placeholder="First name"
                                  autoFocus
                                />
                                <div className="flex gap-3 pt-2">
                                  <button
                                    onClick={closeMobileModal}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const input = document.querySelector(
                                        'input[placeholder="First name"]'
                                      ) as HTMLInputElement;
                                      if (input?.value !== profile.firstName) {
                                        await saveFirstName(input?.value || "");
                                      }
                                      closeMobileModal();
                                    }}
                                    disabled={savingStates.firstName}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                  >
                                    {savingStates.firstName ? (
                                      <>
                                        <svg
                                          className="animate-spin h-4 w-4 text-white"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        <span>Saving...</span>
                                      </>
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                            showMobileModal("Edit First Name", modalContent);
                          } else {
                            toggleFieldEdit("firstName");
                          }
                        }}
                        className="p-1 rounded hover:bg-white/20 transition-all"
                        aria-label="Edit first name"
                      >
                        <Image
                          src={editIcon}
                          alt="edit"
                          width={14}
                          height={14}
                          className="invert opacity-70"
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingFields.lastName ? (
                      <input
                        type="text"
                        defaultValue={profile.lastName}
                        onBlur={async (e) => {
                          if (e.target.value !== profile.lastName) {
                            await saveLastName(e.target.value);
                          }
                          setEditingFields((prev) => ({
                            ...prev,
                            lastName: false,
                          }));
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            const value = e.currentTarget.value;
                            if (value !== profile.lastName) {
                              await saveLastName(value);
                            }
                            setEditingFields((prev) => ({
                              ...prev,
                              lastName: false,
                            }));
                          }
                          if (e.key === "Escape") {
                            setEditingFields((prev) => ({
                              ...prev,
                              lastName: false,
                            }));
                          }
                        }}
                        className="text-2xl font-semibold md:text-3xl bg-white/90 text-slate-900 px-2 py-1 rounded border border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 w-32 md:w-40"
                        placeholder="Last name"
                        autoFocus
                      />
                    ) : (
                      <h1 className="text-2xl font-semibold md:text-3xl">
                        {profile.lastName}
                      </h1>
                    )}
                    {!editingFields.lastName && (
                      <button
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            const modalContent = (
                              <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-700">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  defaultValue={profile.lastName}
                                  onBlur={async (e) => {
                                    if (e.target.value !== profile.lastName) {
                                      await saveLastName(e.target.value);
                                    }
                                    closeMobileModal();
                                  }}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                                  placeholder="Last name"
                                  autoFocus
                                />
                                <div className="flex gap-3 pt-2">
                                  <button
                                    onClick={closeMobileModal}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const input = document.querySelector(
                                        'input[placeholder="Last name"]'
                                      ) as HTMLInputElement;
                                      if (input?.value !== profile.lastName) {
                                        await saveLastName(input?.value || "");
                                      }
                                      closeMobileModal();
                                    }}
                                    disabled={savingStates.lastName}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                  >
                                    {savingStates.lastName ? (
                                      <>
                                        <svg
                                          className="animate-spin h-4 w-4 text-white"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                        <span>Saving...</span>
                                      </>
                                    ) : (
                                      "Save"
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                            showMobileModal("Edit Last Name", modalContent);
                          } else {
                            toggleFieldEdit("lastName");
                          }
                        }}
                        className="p-1 rounded hover:bg-white/20 transition-all"
                        aria-label="Edit last name"
                      >
                        <Image
                          src={editIcon}
                          alt="edit"
                          width={14}
                          height={14}
                          className="invert opacity-70"
                        />
                      </button>
                    )}
                  </div>
                  {getApprovalStatusBadge(profile.approvalStatus)}
                </div>
                {profile.jobTitle && (
                  <p className="mt-1 text-white md:text-[#717680] text-sm md:text-sm">
                    {profile.jobTitle}
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
              {/* About me */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">About me</span>
                </div>
                <InlineEditable
                  value={profile.brief || profile.bio || ""}
                  onSave={saveBio}
                  renderInput={(value, onChange) => (
                    <textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  )}
                  isEditing={editingFields.bio}
                  onEditToggle={() => toggleFieldEdit("bio")}
                  placeholder="No bio available. Click edit to add your bio."
                  showMobileModal={showMobileModal}
                  mobileModalTitle="Edit About Me"
                />
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Quick facts */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Quick Facts</span>
                </div>
                <div className="space-y-4 text-sm">
                  <LocationEditor
                    state={profile.state}
                    city={profile.city}
                    preferredLocation={profile.preferredLocation}
                    onSave={saveLocation}
                    renderInput={renderLocationInput}
                    isEditing={editingFields.location}
                    onEditToggle={() => toggleFieldEdit("location")}
                    showMobileModal={showMobileModal}
                    closeMobileModal={closeMobileModal}
                  />

                  <SalaryEditor
                    minSalary={profile.minExpectedSalary}
                    maxSalary={profile.maxExpectedSalary}
                    onSave={saveSalary}
                    renderInput={renderSalaryInput}
                    isEditing={editingFields.salary}
                    onEditToggle={() => toggleFieldEdit("salary")}
                    showMobileModal={showMobileModal}
                    closeMobileModal={closeMobileModal}
                  />
                </div>
              </section>

              {/* Skills */}
              <section className={`${cardBase} group`}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Skills</span>
                  <button
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        const modalContent = (
                          <div className="space-y-4">
                            {renderSkillsInput()}
                            <div className="flex gap-3 pt-4 border-t border-slate-200">
                              <button
                                onClick={closeMobileModal}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveSkills}
                                disabled={savingStates.skills}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                              >
                                {savingStates.skills ? (
                                  <>
                                    <svg
                                      className="animate-spin h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  "Save"
                                )}
                              </button>
                            </div>
                          </div>
                        );
                        showMobileModal("Edit Skills", modalContent);
                      } else {
                        toggleFieldEdit("skills");
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <Image
                      src={editIcon}
                      alt="edit skills"
                      width={18}
                      height={18}
                    />
                  </button>
                </div>
                {editingFields.skills ? (
                  <div className="space-y-3">
                    {renderSkillsInput()}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={saveSkills}
                        disabled={savingStates.skills}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                      >
                        {savingStates.skills ? (
                          <>
                            <svg
                              className="animate-spin h-3 w-3 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          "Done"
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setEditingFields((prev) => ({
                            ...prev,
                            skills: false,
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.userSkills && profile.userSkills.length > 0 ? (
                      profile.userSkills.map((userSkill) => (
                        <span key={userSkill.id} className={tagBase}>
                          {userSkill.skill?.name || "Unknown"}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No skills added yet
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Verified documents */}
              <section className={cardBase}>
                <div className={sectionTitle}>
                  <span className="text-2xl">Verified Documents</span>
                </div>

                <ul className="space-y-2 text-sm text-slate-800">
                  {cvDocument && (
                    <li className="flex items-center gap-2">
                      <Image
                        src={documentIcon}
                        alt="document"
                        width={16}
                        height={16}
                      />
                      <span>
                        {cvDocument.document.originalName ||
                          cvDocument.document.fileName}
                      </span>
                    </li>
                  )}
                  {!cvDocument && (
                    <li className="text-slate-500">No documents uploaded</li>
                  )}
                </ul>

                <button
                  onClick={() =>
                    router.push("/pages/jobseeker/auth/complete-profile")
                  }
                  className="mt-4 w-full rounded-xl bg-sky-50 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-100"
                >
                  Upload New Document
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
