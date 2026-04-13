"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthorSignup() {
    const [affiliation, setAffiliation] = useState('Undergrad');
    const [classYear, setClassYear] = useState('2026');
    const [major, setMajor] = useState('');
    const [bio, setBio] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [x, setX] = useState('');
    const [website, setWebsite] = useState('');

    // In a real app, a file state might look like this:
    // const [headshot, setHeadshot] = useState<File | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate backend submission for author profile creation
        console.log('Registering Author Profile:', {
            affiliation,
            classYear,
            major,
            bio,
            socials: { linkedin, x, website }
            // headshot: headshot?.name
        });

        alert('Author Profile creation successful! (Backend implementation pending)');
        // Redirect to a placeholder or dashboard later
        // router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Author Profile Details
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome to the team! Help us set up your author page.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">

                        {/* Princeton Affiliation */}
                        <div>
                            <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
                                Princeton Affiliation
                            </label>
                            <select
                                id="affiliation"
                                name="affiliation"
                                value={affiliation}
                                onChange={(e) => setAffiliation(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            >
                                <option value="Undergrad">Undergrad</option>
                                <option value="Grad">Grad</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            {/* Class Year */}
                            <div className="flex-1">
                                <label htmlFor="classYear" className="block text-sm font-medium text-gray-700 mb-1">
                                    Class Year
                                </label>
                                <select
                                    id="classYear"
                                    name="classYear"
                                    value={classYear}
                                    onChange={(e) => setClassYear(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                >
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Major / Department */}
                            <div className="flex-1">
                                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                                    Major / Department
                                </label>
                                <input
                                    id="major"
                                    name="major"
                                    type="text"
                                    required
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                Author Bio (1-3 sentences, for publication)
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                required
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Briefly describe your interests and background..."
                            />
                        </div>

                        {/* Headshot Upload */}
                        <div>
                            <label htmlFor="headshot" className="block text-sm font-medium text-gray-700 mb-1">
                                Headshot Upload <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                id="headshot"
                                name="headshot"
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200"
                            />
                        </div>

                        {/* Social Media Links */}
                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Social Media Links <span className="text-gray-400 font-normal">(Optional)</span></h3>

                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="url"
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                        placeholder="LinkedIn URL"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="url"
                                        value={x}
                                        onChange={(e) => setX(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                        placeholder="X (Twitter) URL"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                        placeholder="Personal Website URL"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 mt-6"
                        >
                            Complete Author Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
