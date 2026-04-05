
import React from 'react';
import Link from 'next/link';

// Mock data fetcher
const getProfile = (id: string) => {
    const profiles: Record<string, any> = {
        'alice-chang': {
            name: 'Alice Chang',
            role: 'Research Assistant',
            bio: 'Alice is a Ph.D. student in the Computer Science department. Her research focuses on the intersection of generative AI and creative expression. She has published papers in top conferences like NeurIPS and ICML.',
            projects: [
                { title: 'Generative Art for All', description: 'A tool that democratizes art creation using diffusion models.' },
                { title: 'AI in Literature', description: 'Analyzing narrative structures in large language models.' }
            ]
        },
        'bob-smith': {
            name: 'Bob Smith',
            role: 'Undergraduate Researcher',
            bio: 'Bob is a junior majoring in Computer Science. He is passionate about NLP and is currently working on optimizing transformer models for edge devices.',
            projects: [
                { title: 'Efficient Transformers', description: 'Reducing the memory footprint of BERT models.' }
            ]
        }
        // Add more mock profiles as needed
    };
    return profiles[id] || null;
};

// In Next.js 15, params are a promise, so we need to await them
export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const profile = getProfile(id);

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
                <p className="text-gray-600 mb-8">The profile you are looking for does not exist.</p>
                <Link href="/profiles" className="text-red-600 hover:text-red-800 font-bold uppercase tracking-wider">
                    Back to Profiles
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/profiles" className="text-gray-500 hover:text-gray-900 text-sm font-bold uppercase tracking-wider mb-8 block">
                &larr; Back to Team
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                    <div className="w-48 h-48 rounded-full bg-gray-200 mb-6 mx-auto md:mx-0 overflow-hidden relative">
                        {/* Profile Image Placeholder */}
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{profile.name}</h1>
                    <p className="text-red-600 font-medium uppercase tracking-wide mb-6 text-center md:text-left">{profile.role}</p>

                    <div className="space-y-4">
                        <h3 className="font-bold border-b border-gray-200 pb-2">Contact</h3>
                        <p className="text-gray-600">email@princeton.edu</p>
                        {/* Social links placeholder */}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Biography</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {profile.bio}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
                        <div className="space-y-6">
                            {profile.projects && profile.projects.map((project: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                    <p className="text-gray-600">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
