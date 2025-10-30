"use client";

import React, { useState, useRef } from "react";
import AuthPageLayout from "@/app/components/authPageLayout";
import Input from "@/app/components/input";
import Button from "@/app/components/button";

type FormValues = {
    jobTitle: string;
    preferredLocation: string;
    jobType: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const CreateProfilePage: React.FC = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        jobTitle: "",
        preferredLocation: "",
        jobType: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // --- file upload state
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const maxFileSizeMB = 10;
    const acceptedFormats = [".pdf", ".docx", ".png", ".jpeg"];

    // --- skills tags state
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>([]);

    const handleChange =
        (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formValues.jobTitle.trim()) {
            newErrors.jobTitle = "Job title is required";
        }
        if (!formValues.preferredLocation.trim()) {
            newErrors.preferredLocation = "Preferred location is required";
        }
        if (!formValues.jobType.trim()) {
            newErrors.jobType = "Job type is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const files = e.target.files;
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    };

    const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const trimmed = skillInput.trim();
        if ((e.key === "Enter" || e.key === ",") && trimmed.length > 0) {
            e.preventDefault();
            // dedupe
            if (!skills.includes(trimmed)) {
                setSkills((prev) => [...prev, trimmed]);
            }
            setSkillInput("");
        }
        if (e.key === "Backspace" && !skillInput && skills.length > 0) {
            e.preventDefault();
            const last = skills[skills.length - 1];
            setSkills((prev) => prev.slice(0, prev.length - 1));
            setSkillInput(last);
        }
    };

    const removeSkill = (idx: number) => {
        setSkills((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFileError(null);

        if (!validate()) {
            return;
        }

        // Validate file if selected
        if (selectedFile) {
            if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
                setFileError(`File size must be no more than ${maxFileSizeMB} MB`);
                return;
            }
            const ext = "." + (selectedFile.name.split(".").pop() || "").toLowerCase();
            if (!acceptedFormats.includes(ext)) {
                setFileError(`Only formats allowed: ${acceptedFormats.join(", ")}`);
                return;
            }
        }

        // Now you have: formValues, selectedFile, skills
        console.log("Submitting profile setup:", {
            formValues,
            selectedFile,
            skills,
        });

        // TODO: send formValues, file & skills to your backend API
    };

    return (
        <AuthPageLayout
            heading="Set up your profile"
            subtext="Help us match you with the perfect roles. You can always update this later."
            message={
                <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
                    {/* Job Title */}
                    <div>
                        <label
                            htmlFor="jobTitle"
                            className="block text-gray-900 font-medium text-lg mb-1"
                        >
                            Job Title
                        </label>
                        <Input
                            id="jobTitle"
                            placeholder="e.g. Baker, Project Manager, Designer"
                            value={formValues.jobTitle}
                            onChange={handleChange("jobTitle")}
                            error={errors.jobTitle}
                        />
                    </div>

                    {/* Preferred Location */}
                    <div>
                        <label
                            htmlFor="preferredLocation"
                            className="block text-gray-900 font-medium text-lg mb-1"
                        >
                            Preferred Location(s)
                        </label>
                        <Input
                            id="preferredLocation"
                            placeholder="e.g. Lagos, Abuja, Oyo..."
                            value={formValues.preferredLocation}
                            onChange={handleChange("preferredLocation")}
                            error={errors.preferredLocation}
                        />
                    </div>

                    {/* Job Type */}
                    <div>
                        <label
                            htmlFor="jobType"
                            className="block text-gray-900 font-medium text-lg mb-1"
                        >
                            Job Type
                        </label>
                        <Input
                            id="jobType"
                            placeholder="e.g. Full-time, Part-time, Contract"
                            value={formValues.jobType}
                            onChange={handleChange("jobType")}
                            error={errors.jobType}
                        />
                    </div>

                    {/* Upload your CV */}
                    <div>
                        <label className="block text-gray-900 font-medium text-lg mb-1">
                            Upload your CV (optional, but highly encouraged)
                        </label>
                        <input
                            ref={inputFileRef}
                            type="file"
                            accept={acceptedFormats.join(",")}
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-600"
                        />
                        {selectedFile && (
                            <p className="mt-2 text-gray-500 text-sm">
                                Selected file: {selectedFile.name}
                            </p>
                        )}
                        {fileError && (
                            <p className="text-red-600 mt-2 text-sm">{fileError}</p>
                        )}
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-gray-900 font-medium text-lg mb-1">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                        onClick={() => removeSkill(idx)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            
                            placeholder="Fill in key skills manually ."
                            className="block w-full border border-gray-300 rounded-md px-4 py-4 text-sm"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillInputKeyDown}
                        />
                        <sub className="text-gray-500">After each skill add a comma(,) e.g time management,</sub>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full py-4 text-base font-medium">
                        Continue
                    </Button>
                </form>
            }
        />
    );
};

export default CreateProfilePage;
