
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="text-white py-12 mt-12" style={{ background: 'linear-gradient(135deg, #1a0040 0%, #0d2a4a 100%)' }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Long Logo */}
                    <div className="flex flex-col items-start">
                        <Image
                            src="/logos/Long Logo - PAIR.png"
                            alt="Princeton AI Review"
                            width={200}
                            height={60}
                            className="object-contain mb-4"
                        />
                        <p className="text-sm" style={{ color: '#83c8f2' }}>
                            Fostering innovation and collaboration in artificial intelligence at Princeton University.
                        </p>
                    </div>

                    {/* Sections */}
                    <div>
                        <h4 className="text-lg mb-4" style={{ color: '#f9a0d0' }}>Sections</h4>
                        <ul className="space-y-2 text-sm" style={{ color: '#83c8f2' }}>
                            <li><Link href="/news" className="transition-colors hover:text-white">News</Link></li>
                            <li><Link href="/technical" className="transition-colors hover:text-white">Technical</Link></li>
                            <li><Link href="/opinion" className="transition-colors hover:text-white">Opinion</Link></li>
                            <li><Link href="/spotlights" className="transition-colors hover:text-white">Spotlights</Link></li>
                            <li><Link href="/humor" className="transition-colors hover:text-white">Humor</Link></li>
                            <li><Link href="/games" className="transition-colors hover:text-white">Games</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-lg mb-4" style={{ color: '#f9a0d0' }}>Connect</h4>
                        <ul className="space-y-2 text-sm" style={{ color: '#83c8f2' }}>
                            <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
                            <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">Twitter</a></li>
                            <li><a href="#" className="transition-colors hover:text-white">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid #38a4e9', color: '#83c8f2' }} suppressHydrationWarning>
                    &copy; {new Date().getFullYear()} Princeton AI Review. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
