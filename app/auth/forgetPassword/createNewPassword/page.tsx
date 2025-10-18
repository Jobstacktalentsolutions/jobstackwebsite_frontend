"use client"
import React, { useState } from 'react'
import AuthPageLayout from "@/app/components/authPageLayout";
import PasswordField from '@/app/components/passwordField';
import Button from '@/app/components/button';
import SuccessModal from '@/app/components/sucessModal';

const CreateNewPassword = () => {
    const [openModal, setOpenModal] = useState(false);

    

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const goToLogin = () => {
        // e.g. router.push("/auth/login");
        handleCloseModal();
    };
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwError, setPwError] = useState<string | undefined>(undefined);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
    setOpenModal(true);
        // Simple validation: check both fields are filled and match
        if (!password || !confirmPassword) {
            setPwError("Both password fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setPwError("Passwords do not match");
            return;
        }

        // TODO: replace with real auth logic
        const fakeInvalid = false;
        if (fakeInvalid) {
            setPwError("Something went wrong, please try again");
        } else {
            setPwError(undefined);
            // proceed to submit password to backend
        }
    }

    return (
        <AuthPageLayout
            heading="Create a new Password"
            subtext="Almost there! Please create a new, strong password for your account."
            message={
                <>
                    <h3>New Password</h3>
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
                        <Button className="w-full my-10 text-medium">Submit</Button>
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
}

export default CreateNewPassword;
