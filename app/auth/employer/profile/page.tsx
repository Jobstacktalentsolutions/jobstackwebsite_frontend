'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';               // ✅ add this
import AuthPageLayout from '@/app/components/AuthPageLayout';
import Input from '@/app/components/input';
import Button from '@/app/components/button';

type FormValues = { residentialAddress: string };

const ProfilePage = () => {
    const router = useRouter();                               // ✅ add this

    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const proofFileRef = useRef<HTMLInputElement | null>(null);

    const [formValues, setFormValues] = useState<FormValues>({ residentialAddress: '' });
    const [idFile, setIdFile] = useState<File | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const maxFileSizeMB = 10;
    const acceptedFormats = ['.pdf', '.docx', '.png', '.jpeg', '.jpg'];

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('profileForm');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.residentialAddress) {
                    setFormValues({ residentialAddress: parsed.residentialAddress });
                }
            }
        } catch {
            localStorage.removeItem('profileForm');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('profileForm', JSON.stringify(formValues));
    }, [formValues]);

    const handleFileChange =
        (type: 'id' | 'proof') => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFileError(null);
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > maxFileSizeMB * 1024 * 1024) {
                setFileError(`File size must be no more than ${maxFileSizeMB} MB`);
                return;
            }
            const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
            if (!acceptedFormats.includes(ext)) {
                setFileError(`Only formats allowed: ${acceptedFormats.join(', ')}`);
                return;
            }

            const saved = JSON.parse(localStorage.getItem('profileForm') || '{}');
            saved[type + 'FileInfo'] = { name: file.name, type: file.type, size: file.size };
            localStorage.setItem('profileForm', JSON.stringify(saved));

            if (type === 'id') setIdFile(file);
            else setProofFile(file);
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFileError(null);

        if (!formValues.residentialAddress.trim()) {
            setFileError('Residential address is required');
            return;
        }
        if (!idFile || !proofFile) {
            setFileError('Please upload both required documents');
            return;
        }

        // Save a final snapshot (safe, JSON-only)
        localStorage.setItem(
            'profileForm',
            JSON.stringify({
                ...formValues,
                idFileInfo: { name: idFile.name, type: idFile.type, size: idFile.size },
                proofFileInfo: { name: proofFile.name, type: proofFile.type, size: proofFile.size },
            })
        );

        // ✅ Redirect to Company Profile (employer flow)
        router.push('/auth/employer/profile/companyProfile');
    };

    return (
        <AuthPageLayout
            heading="Almost there! Verify your identity"
            subtext="This helps build trust with job seekers"
            message={
                <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
                    <Input
                        label="Residential Address"
                        value={formValues.residentialAddress}
                        onChange={(e) =>
                            setFormValues({ residentialAddress: e.target.value })
                        }
                    />

                    <h2 className="text-[18px]">
                        Government Issued ID{' '}
                        <span className="italic text-gray-400">
                            (National ID, Voter&apos;s Card, Driver&apos;s License, or International Passport)
                        </span>
                        <span className="text-red-500">*</span>
                    </h2>
                    <input
                        ref={inputFileRef}
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileChange('id')}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-600"
                    />

                    <h2 className="text-[18px]">
                        Proof of Address{' '}
                        <span className="italic text-gray-400">
                            (Utility bill or tenancy agreement from the last 3 months)
                        </span>
                        <span className="text-red-500">*</span>
                    </h2>
                    <input
                        ref={proofFileRef}
                        type="file"
                        accept={acceptedFormats.join(',')}
                        onChange={handleFileChange('proof')}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-600"
                    />

                    {fileError && <p className="text-red-500 text-sm">{fileError}</p>}

                    <Button className="w-full my-10">Save & Continue</Button>
                </form>
            }
        />
    );
};

export default ProfilePage;
