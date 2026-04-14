"use client";

import React, { useState, useEffect, useRef } from "react";
import { createArticle, fetchWithAuth } from "@/lib/api";
import { API_BASE_URL } from "@/lib/apiClient";

interface Author {
  id: number;
  full_name: string;
  email: string;
}

export default function ArticleForm() {
  const [formData, setFormData] = useState({
    primaryAuthor: "",
    coAuthors: "",
    title: "",
    subtitle: "",
    section: "Technical",
    tags: "",
    abstract: "",
    readTime: "",
    publicationPreference: "Flexible",
    body: "",
    captions: "",
    altText: "",
    mediaCredits: "",
    acknowledgements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Author autocomplete
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [authorQuery, setAuthorQuery] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/authors/`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : [];
        console.log('[ArticleForm] authors loaded:', list.length, list);
        setAllAuthors(list);
      })
      .catch(err => console.error('[ArticleForm] failed to fetch authors:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authorRef.current && !authorRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const authorSuggestions = authorQuery.length > 0
    ? allAuthors.filter(a => a.full_name.toLowerCase().includes(authorQuery.toLowerCase()))
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Submit Article Metadata using the API client
      const articlePayload = {
        title: formData.title,
        subtitle: formData.subtitle,
        section: formData.section.toLowerCase(),
        tags: formData.tags,
        abstract: formData.abstract,
        estimated_read_time: parseInt(formData.readTime) || 5,
        publication_preference: formData.publicationPreference.toLowerCase().replace(' ', '_'),
        body: formData.body,
        acknowledgements: formData.acknowledgements,
      };

      const articleData = await createArticle(articlePayload);
      const articleId = articleData?.id || articleData?.pk;

      // 2. Handle Media Upload if a cover image is provided
      const fileInput = document.querySelector('input[name="coverImage"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0] && articleId) {
        const mediaForm = new FormData();
        mediaForm.append("article", articleId);
        mediaForm.append("file", fileInput.files[0]);
        mediaForm.append("caption", formData.captions);
        mediaForm.append("alt_text", formData.altText);
        mediaForm.append("credit", formData.mediaCredits);
        mediaForm.append("is_cover", "true");

        // Use fetch directly for FormData to avoid default application/json header from fetchWithAuth
        const token = process.env.NEXT_PUBLIC_API_TOKEN || '';
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pair-dj8z.onrender.com'}/api/media/`, {
          method: "POST",
          headers: {
            "Authorization": `Token ${token}`
            // Note: Content-Type is intentionally omitted for FormData so the browser sets the boundary correctly
          },
          body: mediaForm,
        });
      }

      setSuccessMessage("Article submitted successfully!");
      
      // Optionally reset form
      setFormData({
        primaryAuthor: "", coAuthors: "", title: "", subtitle: "", section: "Technical", tags: "", abstract: "",
        readTime: "", publicationPreference: "Flexible", body: "", captions: "", altText: "", mediaCredits: "", acknowledgements: "",
      });
      if (fileInput) fileInput.value = "";
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 px-8 text-white">
        <h1 className="text-3xl font-bold">Submit an Article</h1>
        <p className="mt-2 text-purple-100">Share your thoughts, research, and stories with the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-10 space-y-10">
        
        {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-md">
                {error}
            </div>
        )}
        
        {successMessage && (
            <div className="p-4 text-sm text-green-700 bg-green-50 rounded-md">
                {successMessage}
            </div>
        )}

        {/* 1. Author Selection */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">1. Author Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={authorRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Author</label>
              <input
                type="text"
                placeholder="Search author database..."
                value={authorQuery}
                onChange={e => { setAuthorQuery(e.target.value); setSelectedAuthorId(null); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                className="block w-full rounded-md p-3 border border-gray-300"
                required={!selectedAuthorId}
              />
              {showSuggestions && authorSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {authorSuggestions.map(author => (
                    <li
                      key={author.id}
                      onMouseDown={() => {
                        setAuthorQuery(author.full_name);
                        setSelectedAuthorId(author.id);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      <span className="font-medium">{author.full_name}</span>
                      <span className="text-gray-400 ml-2">{author.email}</span>
                    </li>
                  ))}
                </ul>
              )}
              {showSuggestions && authorQuery.length > 0 && authorSuggestions.length === 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-4 py-2 text-sm text-gray-400">
                  No authors found.
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Co-authors</label>
              <textarea name="coAuthors" value={formData.coAuthors} onChange={handleChange} placeholder="Internal tags/names or External: Name + Class Year + Email" rows={2} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
          </div>
        </section>

        {/* 2. Article Metadata */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">2. Article Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="block w-full rounded-md text-lg p-3 border border-gray-300" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select name="section" value={formData.section} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300 bg-white">
                <option>Technical</option><option>Opinion</option><option>Creative</option><option>Interview</option><option>Humor</option><option>Spotlight</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publication Preference</label>
              <select name="publicationPreference" value={formData.publicationPreference} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300 bg-white">
                <option>ASAP</option><option>Next Issue</option><option>Flexible</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags / Keywords (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Abstract / Summary (2-3 sentences)</label>
              <textarea name="abstract" value={formData.abstract} onChange={handleChange} rows={3} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Read Time (minutes)</label>
               <input type="number" name="readTime" value={formData.readTime} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
          </div>
        </section>

        {/* 3. Article Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">3. Article Content</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Article Body (Markdown Supported)</label>
            <textarea name="body" value={formData.body} onChange={handleChange} rows={12} className="block w-full rounded-md p-3 border border-gray-300 font-mono bg-gray-50" placeholder="Write your article here..." required />
          </div>
        </section>

        {/* 4. Media & Assets */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">4. Media & Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input type="file" name="coverImage" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 p-3 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inline Images</label>
              <input type="file" name="inlineImages" accept="image/*" multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 p-3 border border-gray-300 rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Captions</label>
              <textarea name="captions" value={formData.captions} onChange={handleChange} rows={2} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text for Accessibility</label>
              <input type="text" name="altText" value={formData.altText} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Media Credits / Sources</label>
              <input type="text" name="mediaCredits" value={formData.mediaCredits} onChange={handleChange} className="block w-full rounded-md p-3 border border-gray-300" />
            </div>
          </div>
        </section>

        {/* 5. Collaboration & Credits */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">5. Collaboration & Credits</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Acknowledgements (optional)</label>
            <textarea name="acknowledgements" value={formData.acknowledgements} onChange={handleChange} rows={3} placeholder="Anyone you'd like to thank?" className="block w-full rounded-md p-3 border border-gray-300" />
          </div>
        </section>

        <div className="pt-6">
          <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {isSubmitting ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
