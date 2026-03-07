
import React from 'react';
import Link from 'next/link';

interface ProfileCardProps {
    id: string;
    name: string;
    bio: string;
    role: string;
    imageUrl?: string;
}

export default function ProfileCard({ id, name, bio, role, imageUrl }: ProfileCardProps) {
    return (
        <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-black transition-colors">
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                {/* Placeholder for profile image */}
                {imageUrl && <img src={imageUrl} alt={name} className="object-cover w-full h-full" />}
            </div>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-red-600 text-sm font-medium mb-3 uppercase tracking-wide">{role}</p>
            <p className="text-center text-gray-600 text-sm mb-4 line-clamp-3">
                {bio}
            </p>
            <Link
                href={`/profiles/${id}`}
                className="mt-auto px-4 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
                View Profile
            </Link>
        </div>
    );
}
