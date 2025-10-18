"use client";

import React, { useState } from "react";
import AuthPageLayout from "@/app/components/authPageLayout";
import Input from "@/app/components/input";
import PasswordField from "@/app/components/passwordField";
import Button from "@/app/components/button";

const CreateProfilePage: React.FC = () => {
    const [formValues, setFormValues] = useState({
        jobTitle: "",
        preferredLocation: "",
        jobType: "",
        // add other fields as needed
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        // TODO: Submit formValues to your API or state
        console.log("Submitting profile setup: ", formValues);
    };

    return (
        <AuthPageLayout
            heading="Set up your profile"
            subtext="Help us match you with the perfect roles. You can always update this later."
            message={
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="jobTitle" className="block text-gray-900 font-medium text-lg mb-1">
                            Job Title
                        </label>
                        <Input
                            id="jobTitle"
                            placeholder="e.g., Baker, Project Manager, Designer"
                            value={formValues.jobTitle}
                            onChange={handleChange("jobTitle")}
                            error={errors.jobTitle}
                             
                        />
                    </div>

                    <div>
                        <label htmlFor="preferredLocation" className="block text-gray-900 font-medium text-lg mb-1">
                            Preferred Location(s)
                        </label>
                        <Input
                            id="preferredLocation"
                            placeholder="e.g., Lagos, Abuja, Oyo..."
                            value={formValues.preferredLocation}
                            onChange={handleChange("preferredLocation")}
                            error={errors.preferredLocation}
                          
                        />
                    </div>

                    <div>
                        <label htmlFor="jobType" className="block text-gray-900 font-medium text-lg mb-1">
                            Job Type
                        </label>
                        <Input
                            id="jobType"
                            placeholder="e.g., Full-time, Part-time, Contract"
                            value={formValues.jobType}
                            onChange={handleChange("jobType")}
                            error={errors.jobType}
                             
                        />
                    </div>

                    <Button type="submit" className="w-full py-4 text-base font-medium">
                        Continue
                    </Button>
                </form>
            }
        />
    );
};

export default CreateProfilePage;
