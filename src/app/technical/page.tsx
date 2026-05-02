import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import { getArticles, mapArticle } from '@/lib/api';

export default async function TechnicalPage() {
    let rawArticles = [];
    try {
        rawArticles = await getArticles();
    } catch (error) {
        console.error("Failed to fetch articles:", error);
    }

    if (!Array.isArray(rawArticles)) {
        rawArticles = [];
    }

    const articles = rawArticles
        .filter((a: any) => a.section?.toLowerCase() === 'technical')
        .map(mapArticle);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Technical</h1>
            <p className="text-lg text-gray-600 mb-8">Deep dives into AI research and engineering.</p>
            
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} {...article} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No technical articles published yet.</p>
            )}
        </div>
    );
}
