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
