const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pair-dj8z.onrender.com';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || process.env.API_TOKEN || ''; // Use NEXT_PUBLIC if accessed on client, or regular if server

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (API_TOKEN) {
    headers.set('Authorization', `Token ${API_TOKEN}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = JSON.stringify(errorData);
    } catch {
      // Ignore if parsing fails
    }
    throw new Error(errorMsg);
  }

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Fetch all authors
 */
export async function getAuthors() {
  return fetchWithAuth('/api/authors/', {
    method: 'GET',
  });
}

/**
 * Create a new author profile
 */
export async function createAuthor(data: any) {
  return fetchWithAuth('/api/authors/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Create a new article
 */
export async function createArticle(data: any) {
  return fetchWithAuth('/api/articles/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Fetch all articles and enrich with author names
 */
export async function getArticles() {
  let articles = await fetchWithAuth('/api/articles/', {
    method: 'GET',
    // Next.js caching: revalidate every 60 seconds
    next: { revalidate: 60 }
  });

  if (Array.isArray(articles)) {
    // Only process articles present in submissions_article (handled by the Django /api/articles/ endpoint)
    // Filter out these specific IDs:
    const IGNORED_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
    articles = articles.filter((article: any) => !IGNORED_IDS.includes(article.id));
  }

  try {
    const authors = await getAuthors();
    const authorMap = new Map();
    if (Array.isArray(authors)) {
      authors.forEach((a: any) => authorMap.set(a.id, a.full_name));
    }

    if (Array.isArray(articles)) {
      articles.forEach((article: any) => {
        if (Array.isArray(article.article_authors)) {
          article.article_authors.forEach((aa: any) => {
            if (aa.author) {
              aa.author_name = authorMap.get(aa.author) || 'Unknown Author';
            } else if (aa.external_name) {
              aa.author_name = aa.external_name;
            } else {
              aa.author_name = 'Unknown Author';
            }
          });
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch authors to enrich articles:", error);
  }

  return articles;
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

/**
 * Helper to map backend Article data to frontend ArticleCard props
 */
export function mapArticle(article: any) {
  const authorNames = article.article_authors?.map((aa: any) => 
    aa.author_name
  ).filter(Boolean).join(', ') || 'Unknown Author';

  const coverMedia = article.media?.find((m: any) => m.is_cover) || article.media?.[0];

  const category = article.section ? article.section.charAt(0).toUpperCase() + article.section.slice(1) : 'Article';
  const slug = generateSlug(article.title);
  
  // Map backend section to frontend route (e.g. 'spotlight' -> 'spotlights')
  let routeSection = article.section?.toLowerCase() || 'technical';
  if (routeSection === 'spotlight') {
    routeSection = 'spotlights';
  }

  const url = `/${routeSection}/${slug}`;

  return {
    id: article.id,
    title: article.title,
    excerpt: article.abstract || article.subtitle || '',
    category: category,
    author: authorNames,
    imageUrl: coverMedia?.image_url,
    slug,
    url,
    body: article.body,
  };
}

