"use client";

import React, { useRef, useState } from "react";
import AuthPageLayout from "@/app/pages/components/AuthPageLayout";
import Input from "@/app/pages/components/input";
import Button from "@/app/pages/components/button";

type FormValues = {
    companyName: string;
    companyAddress: string;
    industry: string;
    companySize: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const CompanyProfile = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        companyName: "",
        companyAddress: "",
        industry: "",
        companySize: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // --- file upload state
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const maxFileSizeMB = 10;
    const acceptedFormats = [".pdf", ".docx", ".png", ".jpeg", ".jpg"];

    // ---------- helpers ----------
    const handleChange =
        (field: keyof FormValues) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formValues.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!formValues.companyAddress.trim()) newErrors.companyAddress = "Company address is required";
        if (!formValues.industry.trim()) newErrors.industry = "Industry is required";
        if (!formValues.companySize.trim()) newErrors.companySize = "Company size is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(null);
        const files = e.target.files;
        if (!files || !files[0]) {
            setSelectedFile(null);
            return;
        }
        const file = files[0];

        // validate here (not during render)
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setFileError(`File size must be no more than ${maxFileSizeMB} MB`);
            setSelectedFile(null);
            return;
        }
        const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
        if (!acceptedFormats.includes(ext)) {
            setFileError(`Only formats allowed: ${acceptedFormats.join(", ")}`);
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFileError(null);

        if (!validate()) return;

        // TODO: send formValues + selectedFile to your API
        // e.g., const formData = new FormData(); ... fetch('/api', { method: 'POST', body: formData })
        console.log("Submitting:", { formValues, selectedFile });
    };

    // ---------- render ----------
    return (
        <div>
            <AuthPageLayout
                heading="Tell us about your company!"
                subtext="This information will be shown on your profile"
                message={
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Company Legal Name:"
                            placeholder="Acme Ltd."
                            value={formValues.companyName}
                            onChange={handleChange("companyName")}
                            error={errors.companyName}
                        />

                        <Input
                            label="Company Address:"
                            placeholder="123 Example Street, Lagos"
                            value={formValues.companyAddress}
                            onChange={handleChange("companyAddress")}
                            error={errors.companyAddress}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
                            <select
                                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                                value={formValues.industry}
                                onChange={handleChange("industry")}
                            >
                                <option value="">Select industry</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Trade">Trade</option>
                            </select>
                            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Company size</label>
                            <select
                                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-600 focus:outline-none"
                                value={formValues.companySize}
                                onChange={handleChange("companySize")}
                            >
                                <option value="">Select company size</option>
                                <option value="1-10">1–10</option>
                                <option value="11-30">11–30</option>
                                <option value="30-100">30–100</option>
                                <option value="100+">Above 100</option>
                            </select>
                            {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-900 font-medium text-sm mb-1">
                                Upload your company document (optional)
                            </label>
                            <input
                                ref={inputFileRef}
                                type="file"
                                accept={acceptedFormats.join(",")}
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-600"
                            />
                            {selectedFile && (
                                <p className="mt-2 text-gray-500 text-sm">Selected file: {selectedFile.name}</p>
                            )}
                            {fileError && <p className="text-red-600 mt-2 text-sm">{fileError}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl  py-3 my-10 text-white hover:bg-slate-800 transition"
                        >
                            Save and continue
                        </Button  >
                    </form>
                }
            />
        </div>
    );
};

export default CompanyProfile;
