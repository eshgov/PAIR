"use server";

import { getToken } from "./auth";
import { fetchApi, API_BASE_URL } from "@/lib/apiClient";

export async function createAuthorAction(formData: FormData) {
  const token = await getToken();
  if (!token) return { success: false, error: "Unauthorized" };

  const payload = {
    affiliation: formData.get("affiliation") as string,
    class_year: formData.get("classYear") as string,
    major_department: formData.get("major") as string,
    bio: formData.get("bio") as string,
    linkedin_url: formData.get("linkedin") as string || null,
    twitter_url: formData.get("x") as string || null,
    website_url: formData.get("website") as string || null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create author profile" };
  }
}
