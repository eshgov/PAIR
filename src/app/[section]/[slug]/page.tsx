import React from 'react';
import { notFound } from 'next/navigation';
import { getArticles, mapArticle } from '@/lib/api';

interface ArticleDetailPageProps {
  params: Promise<{
    section: string;
    slug: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { section, slug } = await params;

  let rawArticles = [];
  try {
    rawArticles = await getArticles();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  if (!Array.isArray(rawArticles)) {
    rawArticles = [];
  }

  // Map articles to frontend structure so we get the generated URL
  const articles = rawArticles.map(mapArticle);

  // Find the article whose generated URL matches the current route
  const article = articles.find(
    (a) => a.url === `/${section}/${slug}`
  );

  // If no article matches the URL, show 404
  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <header className="mb-10 text-center">
        <span
          className="text-sm font-bold uppercase tracking-wider mb-4 block"
          style={{ color: '#721ef0' }}
        >
          {article.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-gray-900">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <span className="font-medium text-gray-800">By {article.author}</span>
        </div>
      </header>

      {/* Cover Image */}
      {article.imageUrl ? (
        <div className="mb-12">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-xl shadow-md"
          />
        </div>
      ) : (
        <div className="mb-12 w-full aspect-video rounded-xl" style={{ backgroundColor: '#83c8f2', opacity: 0.2 }} />
      )}

      {/* Body Content */}
      {/* Using whiteSpace: 'pre-wrap' because the backend sends plain text with newlines */}
      <div 
        className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {article.body}
      </div>
    </article>
  );
}
