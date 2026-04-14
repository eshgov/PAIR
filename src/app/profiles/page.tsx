"use client";

import { useState, useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { API_BASE_URL } from '@/lib/apiClient';

interface Author {
    id: number;
    full_name: string;
    affiliation: string;
    bio: string;
    headshot_url: string | null;
    major_department: string;
}

export default function ProfilesPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/authors/`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch authors');
                return res.json();
            })
            .then(data => setAuthors(Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = authors.filter(a =>
        a.full_name.toLowerCase().includes(query.toLowerCase()) ||
        a.major_department.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4 border-b-2 border-black pb-4">Our Team</h1>

            <div className="my-6">
                <input
                    type="text"
                    placeholder="Search by name or department..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && filtered.length === 0 && (
                <p className="text-gray-500">No authors found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filtered.map(author => (
                    <ProfileCard
                        key={author.id}
                        id={String(author.id)}
                        name={author.full_name}
                        role={author.affiliation}
                        bio={author.bio}
                        imageUrl={author.headshot_url ?? undefined}
                    />
                ))}
            </div>
        </div>
    );
}
