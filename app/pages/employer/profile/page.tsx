'use client'
import Image from "next/image";
import React, { useState, useCallback } from "react";
import editIcon from "@/app/assets/editIcon.svg";
import threedots from "@/app/assets/threedots.svg";
import location from "@/app/assets/locationPin.svg";
import documentIcon from "@/app/assets/documentIcon.svg";
import { toastSuccess, toastError } from "@/app/lib/toast";
import {
    empGetProfile,
    empUpdateProfile,
    empGetCompanyLogo,
    empUploadCompanyLogo,
    empDeleteCompanyLogo,
} from "@/app/api/auth-employer.api";
import { EmployerProfile } from "@/app/lib/profile-completion";
import { HouseIcon, Mail, MedalIcon, Phone, User, UserIcon, Paperclip, VerifiedIcon, Globe, Building, UsersIcon, LocateIcon } from "lucide-react";
import { ContentPaste, LocationPin } from "@mui/icons-material";
import JobCard from "../../components/jobcard";
export default function EmployerProfilePage() {
    const [profile, setProfile] = useState<EmployerProfile | null>(null);
    const [savingStates, setSavingStates] = useState<{
        fullName: boolean;
        bio: boolean;
        location: boolean;
        salary: boolean;
        skills: boolean;
        jobTitle: boolean;
        address: boolean;
        phoneNumber: boolean;
    }>({
        fullName: false,
        bio: false,
        location: false,
        salary: false,
        skills: false,
        jobTitle: false,
        address: false,
        phoneNumber: false,
    });
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
    const [editingFields, setEditingFields] = useState<{
        fullName: boolean;
        bio: boolean;
        location: boolean;
        salary: boolean;
        skills: boolean;
        jobTitle: boolean;
        address: boolean;
        phoneNumber: boolean;
    }>({
        fullName: false,
        bio: false,
        location: false,
        salary: false,
        skills: false,
        jobTitle: false,
        address: false,
        phoneNumber: false,
    });
    const [mobileModal, setMobileModal] = useState<{
        isOpen: boolean;
        title: string;
        content: React.ReactNode;
    }>({
        isOpen: false,
        title: "",
        content: null,
    });

    const showMobileModal = useCallback(
        (title: string, content: React.ReactNode) => {
            setMobileModal({ isOpen: true, title, content });
        },
        []
    );
    const fullName =
        `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "User";

    // Close mobile modal
    const closeMobileModal = () => {
        setMobileModal({ isOpen: false, title: "", content: null });
    };
    const toggleFieldEdit = (field: keyof typeof editingFields) => {
        setEditingFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
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
            const result = await empUploadCompanyLogo(file);
            // Reload profile picture
            const pictureData = await empGetCompanyLogo();
            setProfilePicture(pictureData);
            toastSuccess("Profile picture updated successfully");
        } catch (err: any) {
            toastError(
                err?.response?.data?.message || "Failed to upload profile picture"
            );
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 ">
            <div className="md:max-w-4xl lg:max-w-[2000px]  ">
                {/* Header */}
                <div className="bg-[#0F2E43]  px-6 pb-10 lg:pb-24 md:pt-8 lg:pt-12 mb-10 md:px-10 lg:mb-20">
                    {/* Decorative stripes, optional */}
                    <div className="pointer-events-none  absolute inset-y-0 left-0 w-40 opacity-20">
                        <div className="h-full bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
                    </div>

                    <header className="relative  z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-end h-full">
                        {/* Left: avatar and basic info */}
                        <div className="flex text-[#717680] lg:absolute w-full items-start gap-4 md:gap-6 bottom-0 lg:-bottom-[150px] ">
                            <div className="relative group">
                                <div className="h-40 w-20 overflow-hidden rounded-full border-2 border-white/70 bg-slate-200 md:h-20 md:w-20">
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

                            <div className="text-white flex-1 ">
                                <div className="flex flex-wrap items-center gap-2 pb-2">
                                    <div className="flex items-center gap-2">
                                        {editingFields.fullName ? (
                                            <input
                                                type="text"
                                                defaultValue={fullName}
                                                onBlur={async (e) => {
                                                    const value = e.target.value.trim();
                                                    if (value !== fullName && value.includes(" ")) {
                                                        await saveFullName(value);
                                                    } else if (value && !value.includes(" ")) {
                                                        toastError(
                                                            "Please include a space between first and last name"
                                                        );
                                                        setEditingFields((prev) => ({
                                                            ...prev,
                                                            fullName: false,
                                                        }));
                                                    } else {
                                                        setEditingFields((prev) => ({
                                                            ...prev,
                                                            fullName: false,
                                                        }));
                                                    }
                                                }}
                                                onKeyDown={async (e) => {
                                                    if (e.key === "Enter") {
                                                        const value = e.currentTarget.value.trim();
                                                        if (value !== fullName) {
                                                            if (!value.includes(" ")) {
                                                                toastError(
                                                                    "Please include a space between first and last name"
                                                                );
                                                                setEditingFields((prev) => ({
                                                                    ...prev,
                                                                    fullName: false,
                                                                }));
                                                                return;
                                                            }
                                                            await saveFullName(value);
                                                        }
                                                        setEditingFields((prev) => ({
                                                            ...prev,
                                                            fullName: false,
                                                        }));
                                                    }
                                                    if (e.key === "Escape") {
                                                        setEditingFields((prev) => ({
                                                            ...prev,
                                                            fullName: false,
                                                        }));
                                                    }
                                                }}
                                                className="text-2xl font-semibold md:text-3xl bg-white/90 text-slate-900 px-2 py-1 rounded border border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[200px] md:min-w-[300px]"
                                                placeholder="Full name (first last)"
                                                autoFocus
                                            />
                                        ) : (
                                            <h1 className="text-2xl font-semibold md:text-3xl">
                                                {fullName}
                                            </h1>
                                        )}
                                        {!editingFields.fullName && (
                                            <button
                                                onClick={() => {
                                                    if (window.innerWidth < 768) {
                                                        const modalContent = (
                                                            <div className="space-y-4">
                                                                <label className="block text-sm font-medium text-slate-700">
                                                                    Full Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={fullName}
                                                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                                                                    placeholder="Full name (first last)"
                                                                    autoFocus
                                                                />
                                                                <p className="text-xs text-slate-500">
                                                                    Please include a space between first and last
                                                                    name
                                                                </p>
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
                                                                                'input[placeholder="Full name (first last)"]'
                                                                            ) as HTMLInputElement;
                                                                            const value = input?.value?.trim() || "";
                                                                            if (value && value !== fullName) {
                                                                                await saveFullName(value);
                                                                            } else {
                                                                                closeMobileModal();
                                                                            }
                                                                        }}
                                                                        disabled={savingStates.fullName}
                                                                        className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                                                    >
                                                                        {savingStates.fullName ? (
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
                                                        showMobileModal("Edit Full Name", modalContent);
                                                    } else {
                                                        toggleFieldEdit("fullName");
                                                    }
                                                }}
                                                className="p-1 rounded hover:bg-white/20 transition-all"
                                                aria-label="Edit full name"
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
                                    <div>
                                        {/* {getApprovalStatusBadge(profile.approvalStatus)} */}
                                    </div>
                                </div>
                                {/* {profile?.companyName && ( */}
                                <p className="mt-1 text-white md:text-[#717680] text-sm md:text-sm">
                                    {/* {profile.companyName} */}
                                    used to be job title
                                </p>
                                {/* )} */}
                                <div className="flex items-center gap-1 mt-1">
                                    <Image src={location} alt="location" width={16} height={16} />
                                    <p className="text-xs text-white md:text-[#717680] md:text-sm">
                                        {/* {displayLocation} */}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: actions */}
                        <div className="absolute lg:-bottom-[90px]">
                            <div className="flex w-full flex-wrap justify-end gap-3  ">
                                <button className="rounded-lg  text-[#2572A7] px-4 py-2 text-xs font-medium bg-white hover:bg-white/80">
                                    Edit Profile
                                </button>
                                <button className="rounded-lg  bg-[#2572A7] px-4 py-2 text-xs font-medium text-white hover:bg-white/80">
                                    Share Profile
                                </button>
                                <button
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white hover:bg-white/90"
                                    aria-label="More options"
                                >
                                    <Image src={threedots} alt="three dots" />
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                <div className=" grid grid-cols-1 lg:grid-cols-3 p-6 gap-4">
                    {/* Left Column */}
                    <div className="space-y-6 col-span-2">
                        {/* Company's Overview */}
                        <section className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold text-lg mb-4">Company&apos;s Overview</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-900 flex"> <VerifiedIcon className="h-4 w-4 mr-2" /> Company Name</p>
                                    <p className="font-medium text-gray-500">TechBridge Solutions</p>
                                </div>
                                <div>
                                    <p className="text-gray-900 flex"> <Globe className="h-4 w-4 mr-2" /> Website</p>
                                    <p className="text-blue-600 text-gray-500">www.techbridgesolutions.com</p>
                                </div>
                                <div>
                                    <p className="text-gray-900 flex"><Building className="h-4 w-4 mr-2" /> Industry</p>
                                    <p className="font-medium text-gray-500">Software Development</p>
                                </div>
                                <div>
                                    <p className="text-gray-900 flex"> <UsersIcon className="h-4 w-4 mr-2" /> Company Size</p>
                                    <p className="font-medium text-gray-500">51–200 employees</p>
                                </div>
                                <div>
                                    <p className="text-gray-900 flex "> <ContentPaste className="h-4 w-4 mr-2" /> About</p>
                                    <p className="font-medium text-gray-500">TechBridge Solutions is a software engineering company focused on building scalable digital products.</p>
                                </div>
                                <div>
                                    <p className="text-gray-900 flex"><LocationPin className="h-4 w-4 mr-2" /> Location</p>
                                    <p className="font-medium text-gray-500">Lagos, Nigeria</p>
                                </div>
                            </div>
                        </section>

                        {/* Active Job Listings */}
                        <section className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold text-lg mb-4">Active Job Listings</h2>
                            <div className="space-y-4 gap-4 flex">
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
                                    location="Surulere, Lagos"
                                    verified
                                    timePosted="1 day ago"
                                    title="Childminder / Nanny"
                                    description="We need a caring and patient nanny for our 2-year-old son while we are at work."
                                    workType="On-site"
                                    schedule="Monday – Friday (7am – 5pm)"
                                    salary="₦35,000 / month"
                                />
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Recruiter's Contact */}
                        <section className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold text-lg mb-4">Employer&apos;s Contact</h2>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm text-gray-800"> <div className="flex items-center">
                                    <span className="font-light text-gray-600 text-base"><UserIcon className="h-4 w-4 mr-2" /></span>  Name:<br />
                                </div>
                                    Adachi Owosu
                                </p>

                                <p className="text-sm text-wrap text-gray-600">  <div className="flex items-center">
                                    <span className="font-light  text-gray-600 text-sm"><Mail className="h-4 w-4 mr-2" /></span>Email: <br />
                                </div>adachi@techbridgesolutions.com</p>
                                <p className="text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="font-light text-gray-600 text-base"><MedalIcon className="h-4 w-4 mr-2" /> </span>Position:<br />
                                    </div>HR and Talent Manager</p>

                                <p className="text-sm text-gray-600"><div className="flex items-center">
                                    <span className="font-light text-gray-600 text-sm "><Phone className="h-4 w-4 mr-2" /></span> Phone: <br /></div>+234 802 345 6789</p>
                            </div>
                        </section>

                        {/* Verified Documents */}
                        <section className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold text-lg mb-2">Verified Documents</h2>
                            <ul className="   underline">
                                <li className="flex items-center">    <Paperclip className="h-4 w-4 mr-2 " /> Certificate of Incorporation (CAC)</li>
                                <li className="flex items-center">    <Paperclip className="h-4 w-4 mr-2" /> POD</li>
                            </ul>
                        </section>

                        {/* Employer Metrics */}
                        <section className="bg-white p-6 rounded-2xl shadow">
                            <h2 className="font-semibold text-lg mb-4">Employer Metrics</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Total Jobs Posted</p>
                                    <p className="font-semibold">12</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Average Time‑to‑Hire</p>
                                    <p className="font-semibold">9 days</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Applicants</p>
                                    <p className="font-semibold">317</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Total Hires</p>
                                    <p className="font-semibold">12</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
