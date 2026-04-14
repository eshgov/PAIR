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
