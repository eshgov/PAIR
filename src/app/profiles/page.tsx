
import React from 'react';
import ProfileCard from '@/components/ProfileCard';

export default function ProfilesPage() {
    const profiles = [
        {
            id: 'alice-chang',
            name: 'Alice Chang',
            role: 'Research Assistant',
            bio: 'Ph.D. student focusing on generative models and their application in creative arts.',
        },
        {
            id: 'bob-smith',
            name: 'Bob Smith',
            role: 'Undergraduate Researcher',
            bio: 'Computer Science major interested in natural language processing and transformer architectures.',
        },
        {
            id: 'charlie-davis',
            name: 'Charlie Davis',
            role: 'Contributor',
            bio: 'Specializes in computational humor and social robotics.',
        },
        {
            id: 'dana-lee',
            name: 'Dana Lee',
            role: 'Editor',
            bio: 'Philosophy major researching the ethics of autonomous agents.',
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 border-b-2 border-black pb-4">Our Team</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {profiles.map((profile) => (
                    <ProfileCard key={profile.id} {...profile} />
                ))}
            </div>
        </div>
    );
}
