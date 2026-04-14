"use client";

import React, { useState } from 'react';
import { createAuthor } from '@/lib/api';

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

            const data = await createAuthor(payload);
            setSuccessMessage(`Author profile created successfully!`);
            // Reset form optionally
            setFormData({
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
        } catch (err: any) {
            setError(err.message || 'Failed to create author profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Author Profile</h2>
            
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
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
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

                <div className="pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Create Author Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
