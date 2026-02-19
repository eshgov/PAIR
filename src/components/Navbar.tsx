
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
    const navItems = [
        { name: 'News', href: '/news' },
        { name: 'Technical', href: '/technical' },
        { name: 'Opinion', href: '/opinion' },
        { name: 'Spotlight', href: '/spotlights' },
        { name: 'Humor', href: '/humor' },
        { name: 'Games', href: '/games' },
    ];

    return (
        <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-gray-700 transition-colors">
                            PAIR
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-wide"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors uppercase tracking-wide"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wide"
                        >
                            Sign Up
                        </Link>
                        <Link
                            href="/admin/upload"
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors uppercase tracking-wide"
                        >
                            Upload
                        </Link>
                    </div>
                    {/* Mobile menu placeholder - can be expanded later */}
                    <div className="md:hidden">
                        <button className="text-gray-900 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
