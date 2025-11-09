"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/app/components/AuthPageLayout";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import SkillsSelector, {
  type SelectedSkill,
} from "@/app/components/SkillsSelector";
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Briefcase,
  GraduationCap,
  Download,
  X,
} from "lucide-react";
import { toastSuccess, toastError } from "@/app/lib/toast";
import { useProfile } from "@/app/lib/auth-context";
import { jsGetCvDocument } from "@/app/api/auth-jobseeker.api";
import statesAndCities from "@/app/lib/states-and-cities.json";
import { SearchableSelect } from "@/app/components/SearchableSelect";

interface JobseekerProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  state: string;
  city: string;
  bio: string;
  experience: string;
  education: string;
  skills: SelectedSkill[];
  cv: File | null;
}

interface ExistingCvInfo {
  fileName: string;
  signedUrl: string;
  documentId: string;
}

import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";

const JobseekerProfilePage = () => {
  const router = useRouter();
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Check authentication - will redirect if not authenticated
  const { isLoading: authLoading } = useProtectedRoute({
    allowedRoles: ["JOB_SEEKER"],
    redirectTo: "/auth/jobseeker/login",
  });

  // Form state
  const [profileData, setProfileData] = useState<JobseekerProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    state: "",
    city: "",
    bio: "",
    experience: "",
    education: "",
    skills: [],
    cv: null,
  });

  // Get profile from auth context (already loaded)
  const { profile } = useProfile();

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [existingCv, setExistingCv] = useState<ExistingCvInfo | null>(null);

  const maxFileSizeMB = 10;
  const acceptedCvFormats = [".pdf", ".doc", ".docx"];

  // Prepare state options
  const stateOptions = statesAndCities.map((stateData) => ({
    value: stateData.name,
    label: stateData.name,
  }));

  // Prepare city options based on selected state
  const cityOptions =
    statesAndCities
      .find((s) => s.name === profileData.state)
      ?.cities.map((cityName) => ({
        value: cityName,
        label: cityName,
      })) || [];

  // Prefill form fields from profile in context when profile is available
  useEffect(() => {
    const jobSeekerProfile = profile?.jobSeeker;

    if (jobSeekerProfile) {
      // Prefill all form fields from the profile in context
      // This ensures users can complete remaining fields if they've filled part before
      setProfileData((prev) => ({
        ...prev,
        firstName: jobSeekerProfile.firstName || prev.firstName || "",
        lastName: jobSeekerProfile.lastName || prev.lastName || "",
        email: jobSeekerProfile.email || prev.email || "",
        phoneNumber: jobSeekerProfile.phoneNumber || prev.phoneNumber || "",
        state: jobSeekerProfile.state || prev.state || "",
        city: jobSeekerProfile.city || prev.city || "",
        bio: jobSeekerProfile.bio || jobSeekerProfile.brief || prev.bio || "",
        // Note: experience and education fields don't have corresponding backend fields yet
        // They will remain empty or use previous values if user has started filling them
        experience: prev.experience || "",
        education: prev.education || "",
        // Map skills from profile to SelectedSkill format
        skills: jobSeekerProfile.userSkills
          ? jobSeekerProfile.userSkills.map((userSkill: any) => {
              const skill = userSkill.skill || userSkill;
              return {
                id: skill.id,
                name: skill.name,
                proficiency: userSkill.proficiency,
                yearsExperience: userSkill.yearsExperience,
              };
            })
          : jobSeekerProfile.skills
          ? jobSeekerProfile.skills.map((skill: any) => ({
              id: skill.id,
              name: skill.name,
            }))
          : prev.skills || [],
      }));

      // Try to load existing CV if cvUrl or cvDocumentId exists
      if (jobSeekerProfile.cvUrl || jobSeekerProfile.cvDocumentId) {
        jsGetCvDocument()
          .then((cvData) => {
            if (cvData?.document) {
              setExistingCv({
                fileName:
                  cvData.document.originalName || cvData.document.fileName,
                signedUrl: cvData.signedUrl,
                documentId: cvData.document.id,
              });
            }
          })
          .catch((cvErr) => {
            // CV might not exist or might be in different format, that's okay
            console.log("No existing CV found or error loading CV:", cvErr);
          });
      }
    }
  }, [profile?.jobSeeker]);

  const handleInputChange = (
    field: keyof JobseekerProfileData,
    value: string
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSkillsChange = (skills: SelectedSkill[]) => {
    setProfileData((prev) => ({ ...prev, skills }));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError(null);
    const file = e.target.files?.[0];

    if (!file) {
      setProfileData((prev) => ({ ...prev, cv: null }));
      return;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setCvError(`CV file size must be no more than ${maxFileSizeMB} MB`);
      return;
    }

    // Validate file format
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!acceptedCvFormats.includes(ext)) {
      setCvError(`Only formats allowed: ${acceptedCvFormats.join(", ")}`);
      return;
    }

    // When user selects a new file, clear existing CV info
    setExistingCv(null);
    setProfileData((prev) => ({ ...prev, cv: file }));
  };

  // Handle removing existing CV
  const handleRemoveExistingCv = () => {
    setExistingCv(null);
    setProfileData((prev) => ({ ...prev, cv: null }));
    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    if (!profileData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!profileData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!profileData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!profileData.phoneNumber.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!profileData.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!profileData.city.trim()) {
      setError("City/LGA is required");
      return false;
    }
    if (!profileData.bio.trim()) {
      setError("Bio is required");
      return false;
    }
    if (profileData.skills.length === 0) {
      setError("At least one skill is required");
      return false;
    }
    // CV is required only if there's no existing CV
    if (!profileData.cv && !existingCv) {
      setError("CV upload is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add profile data
      formData.append("firstName", profileData.firstName.trim());
      formData.append("lastName", profileData.lastName.trim());
      formData.append("email", profileData.email.trim());
      formData.append("phoneNumber", profileData.phoneNumber.trim());
      formData.append("state", profileData.state.trim());
      formData.append("city", profileData.city.trim());
      formData.append("bio", profileData.bio.trim());
      formData.append("experience", profileData.experience.trim());
      formData.append("education", profileData.education.trim());

      // Add skills
      formData.append("skills", JSON.stringify(profileData.skills));

      // Add CV file
      if (profileData.cv) {
        formData.append("cv", profileData.cv);
      }

      // TODO: Replace with actual API call
      // await updateJobseekerProfile(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toastSuccess("Profile completed successfully!");
      router.push("/dashboard"); // Redirect to main dashboard
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to save profile";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <AuthPageLayout
        heading="Loading..."
        subtext="Please wait while we verify your access"
        message={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      />
    );
  }

  return (
    <AuthPageLayout
      heading="Complete Your Profile"
      subtext="Help employers find you by completing your professional profile"
      message={
        <form className="space-y-6 max-w-2xl" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                iconLeft={<User size={16} />}
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                iconLeft={<User size={16} />}
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                placeholder="your.email@example.com"
                iconLeft={<Mail size={16} />}
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                placeholder="+234 800 000 0000"
                iconLeft={<Phone size={16} />}
                value={profileData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelect
                label="State"
                options={stateOptions}
                value={profileData.state}
                onChange={(value) => {
                  setProfileData((prev) => ({
                    ...prev,
                    state: value,
                    city: "",
                  }));
                }}
                placeholder="Search and select state..."
                required
                icon={<MapPin size={16} />}
                emptyMessage="No state found."
              />

              <SearchableSelect
                label="City/LGA"
                options={cityOptions}
                value={profileData.city}
                onChange={(value) => {
                  setProfileData((prev) => ({ ...prev, city: value }));
                }}
                placeholder={
                  profileData.state
                    ? "Search and select city/LGA..."
                    : "Select state first"
                }
                required
                disabled={!profileData.state}
                icon={<MapPin size={16} />}
                emptyMessage="No city/LGA found."
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Professional Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Tell us about yourself, your career goals, and what makes you unique..."
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Experience
              </label>
              <textarea
                placeholder="Describe your work experience, previous roles, and achievements..."
                value={profileData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Education
              </label>
              <textarea
                placeholder="Your educational background, degrees, certifications..."
                value={profileData.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Skills & Expertise
            </h3>
            <SkillsSelector
              selectedSkills={profileData.skills}
              onSkillsChange={handleSkillsChange}
              maxSkills={15}
              showProficiency={true}
              showExperience={true}
            />
          </div>

          {/* CV Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              CV/Resume Upload
            </h3>

            {/* Show existing CV if available */}
            {existingCv && !profileData.cv && (
              <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {existingCv.fileName}
                      </p>
                      <p className="text-xs text-green-700">
                        Existing CV uploaded
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={existingCv.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                    >
                      <Download size={14} />
                      View
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveExistingCv}
                      className="p-1.5 text-green-700 hover:text-green-900 hover:bg-green-200 rounded transition-colors"
                      title="Remove existing CV"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload new CV section */}
            {(!existingCv || profileData.cv) && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {existingCv
                          ? "Replace CV/Resume"
                          : "Upload your CV/Resume"}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF, DOC, or DOCX up to {maxFileSizeMB}MB
                      </span>
                    </label>
                    <input
                      id="cv-upload"
                      ref={cvInputRef}
                      type="file"
                      accept={acceptedCvFormats.join(",")}
                      onChange={handleCvChange}
                      className="sr-only"
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => cvInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                  {profileData.cv && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ {profileData.cv.name}
                    </div>
                  )}
                  {cvError && (
                    <div className="mt-2 text-sm text-red-600">{cvError}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full py-4 text-base font-medium"
            disabled={submitting}
          >
            {submitting ? "Saving Profile..." : "Complete Profile"}
          </Button>
        </form>
      }
    />
  );
};

// This page is protected by middleware.ts
// No need for client-side protection wrapper
export default JobseekerProfilePage;
