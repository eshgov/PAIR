"use server";

import { getToken } from "./auth";
import { API_BASE_URL } from "@/lib/apiClient";

export async function createAuthorAction(data: {
  full_name: string;
  email: string;
  affiliation: string;
  class_year: number | null;
  major_department: string;
  bio: string;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
}) {
  const token = await getToken();
  if (!token) return { success: false, error: "Not logged in." };

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: JSON.stringify(err) };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create author profile.";
    return { success: false, error: message };
  }
}

export async function getAuthorByEmailAction(email: string) {
  const token = await getToken();
  if (!token) return { success: false, error: "Not logged in." };

  try {
    let currentUrl: string | null = `${API_BASE_URL}/api/authors/`;
    console.log(`[DEBUG] Attempting to find author profile for email: '${email}'`);
    
    while (currentUrl) {
      const response: Response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return { success: false, error: JSON.stringify(err) };
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
      
      const pageEmails = list.map((a: any) => a.email);
      console.log(`[DEBUG] Checking against emails on this page:`, pageEmails);
      
      const author = list.find((a: any) => a.email.toLowerCase() === email.toLowerCase());
      if (author) {
        console.log(`[DEBUG] Found match for email: '${email}'`);
        return { success: true, author };
      }
      
      currentUrl = (!Array.isArray(data) && data.next) ? data.next : null;
      if (currentUrl) {
        console.log(`[DEBUG] Not found on this page, moving to next page: ${currentUrl}`);
      }
    }

    console.log(`[DEBUG] No profile found for email: '${email}' after checking all pages.`);
    return { success: true, author: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch author profile.";
    return { success: false, error: message };
  }
}

export async function updateAuthorAction(
  id: number,
  data: {
    full_name: string;
    email: string;
    affiliation: string;
    class_year: number | null;
    major_department: string;
    bio: string;
    linkedin_url: string | null;
    twitter_url: string | null;
    website_url: string | null;
  }
) {
  const token = await getToken();
  if (!token) return { success: false, error: "Not logged in." };

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: JSON.stringify(err) };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update author profile.";
    return { success: false, error: message };
  }
}

