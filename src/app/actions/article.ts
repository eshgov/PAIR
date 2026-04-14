"use server";

import { getToken } from "./auth";
import { fetchApi, API_BASE_URL } from "@/lib/apiClient";

export async function submitArticleAction(formData: FormData) {
  const token = await getToken();
  if (!token) return { success: false, error: "Unauthorized" };

  try {
    // 1. Submit Article Metadata
    const articlePayload = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      section: (formData.get("section") as string).toLowerCase(),
      tags: formData.get("tags") as string,
      abstract: formData.get("abstract") as string,
      estimated_read_time: parseInt(formData.get("readTime") as string) || 5,
      publication_preference: (formData.get("publicationPreference") as string).toLowerCase().replace(' ', '_'),
      body: formData.get("body") as string,
      acknowledgements: formData.get("acknowledgements") as string,
    };

    const articleResponse = await fetch(`${API_BASE_URL}/api/articles/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(articlePayload),
    });

    if (!articleResponse.ok) {
      const err = await articleResponse.text();
      return { success: false, error: "Failed to create article: " + err };
    }

    const articleData = await articleResponse.json();
    const articleId = articleData.id || articleData.pk; // assuming id is returned

    // 2. Link Primary Author (Simulated for now, assumes author ID is linked to current token)
    // In a real scenario we might need to lookup the author by the string typed, or use the logged in user's author ID.
    // For now we submit the link to backend
    // POST /api/article-authors/
    
    // 3. Media Upload (Cover Image)
    const coverImage = formData.get("coverImage") as File;
    if (coverImage && coverImage.size > 0) {
      const mediaForm = new FormData();
      mediaForm.append("article", articleId);
      mediaForm.append("file", coverImage); // The file itself, we assume Django accepts this 
      mediaForm.append("caption", formData.get("captions") as string);
      mediaForm.append("alt_text", formData.get("altText") as string);
      mediaForm.append("credit", formData.get("mediaCredits") as string);
      mediaForm.append("is_cover", "true");

      await fetch(`${API_BASE_URL}/api/media/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Let fetch set the multipart/form-data boundary automatically
        },
        body: mediaForm,
      });
    }

    return { success: true, articleId: articleId };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit article" };
  }
}
