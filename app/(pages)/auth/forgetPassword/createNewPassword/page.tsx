"use client";

import React, { useState } from "react";
import AuthPageLayout from "@/app/components/authPageLayout";
import PasswordField from "@/app/components/passwordField";
import Button from "@/app/components/button";
import SuccessModal from "@/app/components/sucessModal";  // make sure this path/name is correct

const CreateNewPassword: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState<string | undefined>(undefined);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const goToLogin = () => {
        // navigate to login page here if using next/router or next/navigation
        handleCloseModal();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(undefined);  // clear error at start

        // validation: ensure both fields filled
        if (!password || !confirmPassword) {
            setPwError("Both password fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setPwError("Passwords do not match");
            return;
        }

        // If all good: open modal
        setOpenModal(true);

        // TODO: call your backend API here to actually update the password
        // After successful response, openModal is shown
        // On failure, set error message instead of opening
    };

    return (
        <AuthPageLayout
            heading="Create a new Password"
            subtext="Almost there! Please create a new, strong password for your account."
            message={
                <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">New Password</h3>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <PasswordField
                            label="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (pwError) setPwError(undefined);
                            }}
                            error={pwError}
                        />
                        <PasswordField
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (pwError) setPwError(undefined);
                            }}
                            showHints={false}
                            error={pwError}
                        />
                        <Button type="submit" className="w-full py-4 text-base font-medium">
                            Submit
                        </Button>
                    </form>
                    <SuccessModal
                        open={openModal}
                        onClose={handleCloseModal}
                        onLogin={goToLogin}
                        message="Your password has been reset. Please log in with your new password."
                    />
                </>
            }
        />
    );
};

export default CreateNewPassword;
