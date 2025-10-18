"use client";

import React from "react";
import AuthPageLayout from "@/app/components/authPageLayout";
import Input from "@/app/components/input";
import Button from "@/app/components/button";

export type ProfileSetupProps = {
    heading: string;
    subtext: string;
    onSkip?: () => void;
    onContinue: (data: {
        jobTitle: string;
        preferredLocation: string;
        jobType: string;
        cvFile?: File;
    }) => void;
};

const ProfileSetup: React.FC<ProfileSetupProps> = ({
    heading,
    subtext,
    onSkip,
    onContinue,
}) => {
    const [jobTitle, setJobTitle] = React.useState("");
    const [preferredLocation, setPreferredLocation] = React.useState("");
    const [jobType, setJobType] = React.useState("");
    const [cvFile, setCvFile] = React.useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue({ jobTitle, preferredLocation, jobType, cvFile: cvFile || undefined });
    };

    return (
        <AuthPageLayout
            heading={heading}
            subtext={subtext}
            skipButton={onSkip}
            /* assumes your layout supports a “skipButton” prop for “Skip for now” */
            message={
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                    <div>
                        <label htmlFor="jobTitle" className="block text-gray-900 font-medium text-lg mb-1">
                            Job Title
                        </label>
                        <Input
                            id="jobTitle"
                            placeholder="e.g. Baker, Project Manager, Designer..."
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="preferredLocation" className="block text-gray-900 font-medium text-lg mb-1">
                            Preferred Location(s)
                        </label>
                        <Input
                            id="preferredLocation"
                            placeholder="Lagos, Oyo, Abuja, etc"
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="jobType" className="block text-gray-900 font-medium text-lg mb-1">
                            Job Type
                        </label>
                        <select
                            id="jobType"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select job type</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="cvFile" className="block text-gray-900 font-medium text-lg mb-1">
                            Upload your CV (optional, but highly encouraged)
                        </label>
                        <input
                            id="cvFile"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {cvFile && (
                            <p className="mt-2 text-gray-500 text-sm">
                                Selected file: {cvFile.name}
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        <Button type="submit" className="w-full py-3 text-base font-semibold">
                            Continue
                        </Button>
                    </div>
                </form>
            }
        />
    );
};

export default ProfileSetup;
