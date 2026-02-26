"use client";

import React, { useState } from 'react';

export default function AdminUploadPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadSuccess(false);
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setUploadSuccess(false);

        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
            setFile(null);

            // Re-render issue with file input might arise if we don't clear the input manually
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Upload PDF Article
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Admin Portal
                    </p>
                </div>

                {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 text-sm text-center font-medium">
                        ✓ PDF file successfully uploaded! (Simulated)
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleUpload}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Select PDF File
                            </label>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept=".pdf"
                                required
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-100 file:text-gray-900
                                hover:file:bg-gray-200 file:cursor-pointer pb-2"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!file || isUploading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!file || isUploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                                } transition-colors duration-200`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload PDF'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
