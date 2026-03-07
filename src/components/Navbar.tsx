"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAdmin = () => {
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };

        checkAdmin();
        window.addEventListener('auth-change', checkAdmin);

        return () => window.removeEventListener('auth-change', checkAdmin);
    }, []);

    const navItems = [
        { name: 'News', href: '/news' },
        { name: 'Technical', href: '/technical' },
        { name: 'Opinion', href: '/opinion' },
        { name: 'Spotlight', href: '/spotlights' },
        { name: 'Humor', href: '/humor' },
        { name: 'Games', href: '/games' },
    ];

    return (
        <nav style={{ borderBottom: '2px solid #83c8f2' }} className="sticky top-0 bg-white z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Box Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <Image
                                src="/logos/Box Logo - PAIR.png"
                                alt="PAIR Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium uppercase tracking-wide transition-colors"
                                style={{ color: '#000000' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#721ef0')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {isAdmin ? (
                            <button
                                onClick={() => {
                                    localStorage.removeItem('isAdmin');
                                    window.dispatchEvent(new Event('auth-change'));
                                    if (pathname === '/admin/upload-pdf') {
                                        router.push('/');
                                    }
                                }}
                                className="text-white px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#721ef0' }}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="text-white px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#721ef0' }}
                            >
                                Login
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="/admin/upload-pdf"
                                className="text-white px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#38a4e9' }}
                            >
                                Upload PDF
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu icon */}
                    <div className="md:hidden">
                        <button className="focus:outline-none" style={{ color: '#721ef0' }}>
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
