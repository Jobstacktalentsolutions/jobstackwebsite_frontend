"use client";

import React, { useState } from "react";
import AuthPageLayout from "@/app/components/authPageLayout";
import PasswordField from "@/app/components/passwordField";
import Button from "@/app/components/button";
import SuccessModal from "@/app/components/sucessModal";
import { useSearchParams, useRouter } from "next/navigation";
import { jsResetPassword } from "@/app/api/auth-jobseeker.api";

const CreateNewPassword: React.FC = () => {
    const params = useSearchParams();
    const router = useRouter();
    const resetToken = params.get("token") ?? "";

    const [openModal, setOpenModal] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const goToLogin = () => {
        router.push("/auth/login");
        handleCloseModal();
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(undefined);

        if (!password || !confirmPassword) {
            setPwError("Both password fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setPwError("Passwords do not match");
            return;
        }
        if (!resetToken) {
            setPwError("Invalid or missing reset token");
            return;
        }

        setSubmitting(true);
        try {
            await jsResetPassword({ resetToken, newPassword: password });
            setOpenModal(true);
        } catch {
            setPwError("Failed to reset password");
        } finally {
            setSubmitting(false);
        }
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
                        <Button type="submit" disabled={submitting} className="w-full py-4 text-base font-medium">
                            {submitting ? "Submitting..." : "Submit"}
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
