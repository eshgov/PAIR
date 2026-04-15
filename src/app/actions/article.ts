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
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(articlePayload),
    });

    if (!articleResponse.ok) {
      const err = await articleResponse.text();
      return { success: false, error: "Failed to create article: " + err };
    }

    const articleData = await articleResponse.json();
    const articleId = articleData.id || articleData.pk; // assuming id is returned

    // 2. Link Authors
    const primaryAuthorId = formData.get("primaryAuthorId") as string;
    const coAuthorIds = formData.getAll("coAuthorIds") as string[];

    // Link Primary
    if (primaryAuthorId) {
      await fetch(`${API_BASE_URL}/api/article-authors/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
        body: JSON.stringify({ article: articleId, author: parseInt(primaryAuthorId), is_primary: true }),
      });
    }

    // Link Co-Authors
    for (const coId of coAuthorIds) {
      await fetch(`${API_BASE_URL}/api/article-authors/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
        body: JSON.stringify({ article: articleId, author: parseInt(coId), is_primary: false }),
      });
    }
    
    // 3. Media Upload (Cover Image)
    const coverImage = formData.get("coverImage") as File;
    if (coverImage && coverImage.size > 0) {
      const mediaForm = new FormData();
      mediaForm.append("article", articleId);
      mediaForm.append("image_url", coverImage); // Maps nicely into the ImageField
      mediaForm.append("caption", formData.get("captions") as string);
      mediaForm.append("alt_text", formData.get("altText") as string);
      mediaForm.append("credit", formData.get("mediaCredits") as string);
      mediaForm.append("is_cover", "true");

      await fetch(`${API_BASE_URL}/api/media/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`
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
