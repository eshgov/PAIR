import Link from 'next/link';
import { API_BASE_URL } from '@/lib/apiClient';

interface Author {
    id: number;
    full_name: string;
    email: string;
    affiliation: string;
    class_year: number | null;
    major_department: string;
    bio: string;
    headshot_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    website_url: string | null;
}

async function getAuthor(id: string): Promise<Author | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/authors/${id}/`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const author = await getAuthor(id);

    if (!author) {
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

    const affiliationLabel: Record<string, string> = {
        undergrad: 'Undergraduate',
        grad: 'Graduate',
        faculty: 'Faculty',
        other: 'Contributor',
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/profiles" className="text-gray-500 hover:text-gray-900 text-sm font-bold uppercase tracking-wider mb-8 block">
                &larr; Back to Team
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                    <div className="w-48 h-48 rounded-full bg-gray-200 mb-6 mx-auto md:mx-0 overflow-hidden">
                        {author.headshot_url && (
                            <img src={author.headshot_url} alt={author.full_name} className="object-cover w-full h-full" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{author.full_name}</h1>
                    <p className="text-red-600 font-medium uppercase tracking-wide mb-1 text-center md:text-left">
                        {affiliationLabel[author.affiliation] ?? author.affiliation}
                    </p>
                    {author.major_department && (
                        <p className="text-gray-500 text-sm mb-6 text-center md:text-left">{author.major_department}</p>
                    )}

                    <div className="space-y-2">
                        <h3 className="font-bold border-b border-gray-200 pb-2">Links</h3>
                        {author.linkedin_url && (
                            <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">LinkedIn</a>
                        )}
                        {author.twitter_url && (
                            <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">Twitter / X</a>
                        )}
                        {author.website_url && (
                            <a href={author.website_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">Website</a>
                        )}
                        {!author.linkedin_url && !author.twitter_url && !author.website_url && (
                            <p className="text-gray-400 text-sm">No links provided.</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Biography</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {author.bio || 'No biography provided.'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
