
import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Long Logo — large, centered */}
            <div className="flex justify-center mb-10">
                <Image
                    src="/logos/Long Logo - PAIR.png"
                    alt="Princeton AI Review"
                    width={480}
                    height={140}
                    className="object-contain"
                    priority
                />
            </div>

            {/* About Us content */}
            <div className="max-w-3xl mx-auto text-center">
                <h1
                    className="text-4xl mb-6"
                    style={{ color: '#721ef0' }}
                >
                    About Us
                </h1>

                <p className="text-lg mb-5 leading-relaxed">
                    The <strong>Princeton AI Review (PAIR)</strong> is a student-run academic journal at Princeton University
                    dedicated to exploring the frontiers of artificial intelligence. We provide a platform for undergraduate
                    and graduate students to publish rigorous research, thoughtful opinion pieces, technical deep-dives,
                    and creative works at the intersection of AI and society.
                </p>

                <p className="text-lg mb-5 leading-relaxed">
                    Our mission is to foster a vibrant intellectual community around AI on campus — bridging disciplines,
                    sparking conversations, and showcasing the exceptional work being done by Princeton students and researchers.
                    Whether you are writing about the ethics of large language models, the mathematics of neural architectures,
                    or the humor behind AI&apos;s most spectacular failures, PAIR is your home.
                </p>

                <p className="text-lg mb-5 leading-relaxed">
                    Founded in 2025, PAIR publishes across six sections: <em>News</em>, <em>Technical</em>, <em>Opinion</em>,
                    <em> Spotlights</em>, <em>Humor</em>, and <em>Games</em> — reflecting the full spectrum of how AI touches
                    our world. We welcome contributions from across all departments and are always looking for new voices
                    to join our growing team.
                </p>

                <div className="mt-8">
                    <a
                        href="mailto:pair@princeton.edu"
                        className="inline-block px-8 py-3 rounded-md text-white text-sm uppercase tracking-wide font-semibold transition-opacity hover:opacity-80"
                        style={{ backgroundColor: '#38a4e9' }}
                    >
                        Get In Touch
                    </a>
                </div>
            </div>
        </div>
    );
}
