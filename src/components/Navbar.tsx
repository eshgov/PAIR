"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isNormalUser, setIsNormalUser] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
            setIsAuthor(localStorage.getItem('isAuthorLoggedIn') === 'true');
            setIsNormalUser(localStorage.getItem('isNormalUserLoggedIn') === 'true');
        };

        checkAuth();
        window.addEventListener('auth-change', checkAuth);

        return () => window.removeEventListener('auth-change', checkAuth);
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
                        {!(isAdmin || isAuthor || isNormalUser) && (
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
                        {isAuthor && (
                            <Link
                                href="/submit"
                                className="text-white px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-80"
                                style={{ backgroundColor: '#83c8f2' }}
                            >
                                Submit Article
                            </Link>
                        )}
                        {(isAdmin || isAuthor || isNormalUser) && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-white px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-80 focus:outline-none flex items-center"
                                    style={{ backgroundColor: '#f9a0d0' }}
                                >
                                    Profile
                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5">
                                        <Link
                                            href={isAuthor ? "/signup/author" : "/profile"}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Details
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                localStorage.removeItem('isAdmin');
                                                localStorage.removeItem('isAuthorLoggedIn');
                                                localStorage.removeItem('authorName');
                                                localStorage.removeItem('isNormalUserLoggedIn');
                                                localStorage.removeItem('userEmail');
                                                window.dispatchEvent(new Event('auth-change'));
                                                if (pathname === '/admin/upload-pdf' || pathname === '/submit' || pathname === '/profile' || pathname === '/signup/author') {
                                                    router.push('/');
                                                }
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
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
