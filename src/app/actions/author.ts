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
    const url = `${API_BASE_URL}/api/authors/?email=${encodeURIComponent(email)}`;
    console.log(`[DEBUG] Attempting to find author profile for email: '${email}'`);
    
    const response: Response = await fetch(url, {
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
    
    if (list.length > 0) {
      console.log(`[DEBUG] Found match for email: '${email}'`);
      return { success: true, author: list[0] };
    }

    console.log(`[DEBUG] No profile found for email: '${email}'`);
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

