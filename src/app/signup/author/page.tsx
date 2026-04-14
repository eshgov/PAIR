"use client";

import React from 'react';
import AuthorForm from '@/components/AuthorForm';

export default function AuthorSignup() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Welcome to the Team
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Help us set up your author page below.
                </p>
            </div>
            
            <AuthorForm />
        </div>
    );
}
