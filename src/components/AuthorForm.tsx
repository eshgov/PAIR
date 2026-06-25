"use client";

import React, { useState, useEffect } from 'react';
import { createAuthorAction, getAuthorByEmailAction, updateAuthorAction } from '@/app/actions/author';
import { getCurrentUserAction } from '@/app/actions/auth';

export default function AuthorForm() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        affiliation: 'undergrad',
        class_year: 2026,
        major_department: '',
        bio: '',
        linkedin_url: '',
        twitter_url: '',
        website_url: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingModeActive, setIsEditingModeActive] = useState(false);
    const [authorId, setAuthorId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                let userEmail = '';
                const userResult = await getCurrentUserAction();
                console.log("[DEBUG] getCurrentUserAction result:", userResult);
                
                if (userResult.success && userResult.user?.email) {
                    userEmail = userResult.user.email;
                } else {
                    userEmail = localStorage.getItem('userEmail') || '';
                    console.log("[DEBUG] Fallback to localStorage userEmail:", userEmail);
                }

                console.log("[DEBUG] Final resolved userEmail:", userEmail);

                if (userEmail) {
                    setFormData(prev => ({ ...prev, email: userEmail }));
                    
                    console.log("[DEBUG] Calling getAuthorByEmailAction with:", userEmail);
                    const authorResult = await getAuthorByEmailAction(userEmail);
                    if (authorResult.success && authorResult.author) {
                        const author = authorResult.author;
                        setIsEditing(true);
                        setAuthorId(author.id);
                        setFormData({
                            full_name: author.full_name || '',
                            email: author.email || userEmail,
                            affiliation: author.affiliation || 'undergrad',
                            class_year: author.class_year || 2026,
                            major_department: author.major_department || '',
                            bio: author.bio || '',
                            linkedin_url: author.linkedin_url || '',
                            twitter_url: author.twitter_url || '',
                            website_url: author.website_url || ''
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load author profile details:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Replace empty strings with null for URLs if backend expects null
            const payload = {
                ...formData,
                linkedin_url: formData.linkedin_url || null,
                twitter_url: formData.twitter_url || null,
                website_url: formData.website_url || null,
            };

            if (isEditing && authorId !== null) {
                const result = await updateAuthorAction(authorId, payload);
                if (!result.success) {
                    setError(result.error || 'Failed to update author profile.');
                    return;
                }
                setSuccessMessage(`Author profile updated successfully!`);
                setIsEditingModeActive(false);
            } else {
                const result = await createAuthorAction(payload);
                if (!result.success) {
                    setError(result.error || 'Failed to create author profile.');
                    return;
                }
                setSuccessMessage(`Author profile created successfully!`);
                
                // Fetch the newly created profile details to switch into Edit mode
                const authorResult = await getAuthorByEmailAction(formData.email);
                if (authorResult.success && authorResult.author) {
                    setIsEditing(true);
                    setAuthorId(authorResult.author.id);
                    setIsEditingModeActive(false);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit author profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-8 text-center text-gray-500 font-medium">
                Loading author profile details...
            </div>
        );
    }

    // Placard layout when just viewing the loaded author profile
    if (isEditing && !isEditingModeActive) {
        const affiliationLabel: Record<string, string> = {
            undergrad: 'Undergraduate',
            grad: 'Graduate',
            faculty: 'Faculty',
            other: 'Contributor',
        };

        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-8">
                {successMessage && (
                    <div className="mb-6 p-4 text-sm text-green-700 bg-green-50 rounded-md">
                        {successMessage}
                    </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{formData.full_name}</h2>
                        <p className="text-red-600 font-semibold uppercase tracking-wider text-sm mb-2">
                            {affiliationLabel[formData.affiliation] || formData.affiliation}
                        </p>
                        {formData.major_department && (
                            <p className="text-gray-500 text-sm">
                                {formData.major_department} {formData.class_year ? `(${formData.class_year})` : ''}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setSuccessMessage(null);
                            setError(null);
                            setIsEditingModeActive(true);
                        }}
                        className="px-4 py-2 border border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors duration-200"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Biography</h3>
                    <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                        {formData.bio || 'No biography provided.'}
                    </p>

                    <div className="space-y-2 border-t border-gray-100 pt-6">
                        <h3 className="text-md font-bold text-gray-900 mb-2">Contact & Socials</h3>
                        <p className="text-gray-600 text-sm">
                            <span className="font-semibold text-gray-800">Email:</span> {formData.email}
                        </p>
                        {formData.linkedin_url && (
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-gray-800">LinkedIn:</span>{' '}
                                <a href={formData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {formData.linkedin_url}
                                </a>
                            </p>
                        )}
                        {formData.twitter_url && (
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-gray-800">Twitter / X:</span>{' '}
                                <a href={formData.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {formData.twitter_url}
                                </a>
                            </p>
                        )}
                        {formData.website_url && (
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-gray-800">Website:</span>{' '}
                                <a href={formData.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {formData.website_url}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditing ? 'Edit Author Profile' : 'Create Author Profile'}
            </h2>
            
            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-md">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="mb-4 p-4 text-sm text-green-700 bg-green-50 rounded-md">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            required
                            disabled={isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black ${
                                isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
                        <select
                            name="affiliation"
                            value={formData.affiliation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black bg-white"
                        >
                            <option value="undergrad">Undergraduate</option>
                            <option value="grad">Graduate</option>
                            <option value="faculty">Faculty</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Year</label>
                        <input
                            type="number"
                            name="class_year"
                            value={formData.class_year}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Major / Department *</label>
                        <input
                            type="text"
                            name="major_department"
                            required
                            value={formData.major_department}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
                        <textarea
                            name="bio"
                            required
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                        <input
                            type="url"
                            name="twitter_url"
                            value={formData.twitter_url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                        <input
                            type="url"
                            name="website_url"
                            value={formData.website_url}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex space-x-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : isEditing ? 'Save Changes' : 'Create Author Profile'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => {
                                setSuccessMessage(null);
                                setError(null);
                                setIsEditingModeActive(false);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
