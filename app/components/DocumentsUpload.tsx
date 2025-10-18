"use client";

import React, { useState, useRef } from "react";

type DocumentUploadProps = {
    apiEndpoint: string; // URL where to POST the file(s)
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
    maxFileSizeMB?: number;
    acceptedFormats?: string; // e.g. ".pdf,.docx,.png"
};

export default function DocumentUpload({
    apiEndpoint,
    onSuccess,
    onError,
    maxFileSizeMB = 10,
    acceptedFormats = ".pdf,.docx,.png,.jpeg",
}: DocumentUploadProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null);
        if (e.target.files) {
            const files = e.target.files;
            // validate size
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > maxFileSizeMB * 1024 * 1024) {
                    setErrorMessage(
                        `File “${file.name}” exceeds the maximum size of ${maxFileSizeMB} MB.`
                    );
                    return;
                }
            }
            setSelectedFiles(files);
        }
    };

    const handleUpload = async () => {
        if (!selectedFiles) {
            setErrorMessage("No documents selected");
            return;
        }
        setUploading(true);
        const formData = new FormData();
        // if you support multiple, loop
        Array.from(selectedFiles).forEach((file) => {
            formData.append("documents", file);
        });

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Upload failed (${response.status})`);
            }
            const data = await response.json();
            setUploading(false);
            setSelectedFiles(null);
            inputRef.current && (inputRef.current.value = "");
            onSuccess && onSuccess(data);
        } catch (error) {
            setUploading(false);
            const errMsg = error instanceof Error ? error.message : "Upload failed";
            setErrorMessage(errMsg);
            onError && onError(error);
        }
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Documents
            </label>
            <input
                ref={inputRef}
                type="file"
                accept={acceptedFormats}
                multiple
                onChange={handleFileChange}
                className="border border-gray-300 rounded p-2"
            />

            {selectedFiles && (
                <div className="mt-2">
                    <strong>Selected files:</strong>
                    <ul className="list-disc ml-5 mt-1">
                        {Array.from(selectedFiles).map((file) => (
                            <li key={file.name}>
                                {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {errorMessage && (
                <p className="text-red-600 mt-2">{errorMessage}</p>
            )}

            <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className={`mt-4 px-4 py-2 rounded bg-blue-600 text-white ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
            >
                {uploading ? "Uploading…" : "Upload"}
            </button>
        </div>
    );
}
