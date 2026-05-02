
import React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
    title: string;
    excerpt: string;
    category: string;
    author: string;
    className?: string;
    imageUrl?: string;
    url?: string;
}

export default function ArticleCard({ title, excerpt, category, author, imageUrl, url, className = '' }: ArticleCardProps) {
    // The entire card should ideally be clickable, but wrapping the image and title works too.
    // For now, we'll keep the existing structure and make the image and title link to the article.
    const articleUrl = url || '#';

    return (
        <div className={`flex flex-col group ${className}`}>
            {/* Image or placeholder */}
            <Link href={articleUrl}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="aspect-video mb-4 w-full rounded-md object-cover transition-opacity hover:opacity-90"
                    />
                ) : (
                    <div
                        className="aspect-video mb-4 w-full rounded-md transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#83c8f2', opacity: 0.4 }}
                    />
                )}
            </Link>
            {/* Category badge */}
            <div className="flex items-center space-x-2 mb-2">
                <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#721ef0' }}
                >
                    {category}
                </span>
            </div>
            {/* Title */}
            <h3
                className="text-xl leading-tight mb-2 transition-colors group-hover:opacity-80"
                style={{ color: '#000000' }}
            >
                <Link href={articleUrl} style={{ color: 'inherit' }}>{title}</Link>
            </h3>
            {/* Excerpt */}
            <p className="text-sm mb-3 line-clamp-3" style={{ color: '#444444' }}>
                {excerpt}
            </p>
            {/* Author */}
            <div className="mt-auto">
                <span className="text-xs font-medium" style={{ color: '#38a4e9' }}>By {author}</span>
            </div>
        </div>
    );
}
