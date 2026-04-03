"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NormalUserProfile() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const isNormalUser = localStorage.getItem('isNormalUserLoggedIn') === 'true';

        if (!isNormalUser) {
            router.push('/login');
        } else {
            setEmail(userEmail || 'Unknown User');
        }
    }, [router]);

    if (!email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center">
                <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl font-bold text-purple-700">
                        {email.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-lg text-gray-600 font-medium">{email}</p>
            </div>
        </div>
    );
}
