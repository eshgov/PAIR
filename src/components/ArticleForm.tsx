"use client";

import React, { useState, useEffect, useRef } from "react";
import { submitArticleAction } from "@/app/actions/article";
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
  const [inlineImageUrls, setInlineImageUrls] = useState<string[]>([]);

  // Author autocomplete
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [authorQuery, setAuthorQuery] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);

  // Co-Author autocomplete
  const [selectedCoAuthors, setSelectedCoAuthors] = useState<Author[]>([]);
  const [coAuthorQuery, setCoAuthorQuery] = useState('');
  const [showCoAuthorSuggestions, setShowCoAuthorSuggestions] = useState(false);
  const coAuthorRef = useRef<HTMLDivElement>(null);

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
      if (coAuthorRef.current && !coAuthorRef.current.contains(e.target as Node)) {
        setShowCoAuthorSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const authorSuggestions = authorQuery.length > 0
    ? allAuthors.filter(a => a.full_name.toLowerCase().includes(authorQuery.toLowerCase()))
    : [];

  const coAuthorSuggestions = coAuthorQuery.length > 0
    ? allAuthors.filter(a => 
        a.full_name.toLowerCase().includes(coAuthorQuery.toLowerCase()) && 
        a.id !== selectedAuthorId && 
        !selectedCoAuthors.find(ca => ca.id === a.id)
      )
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
      // Step 1: Upload image directly from browser to Supabase (bypasses Server Action body limits)
      let coverImageUrl: string | null = null;
      const fileInput = document.querySelector('input[name="coverImage"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const uploadForm = new FormData();
        uploadForm.append("file", fileInput.files[0]);
        uploadForm.append("folder", "article_media");

        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          setError(`Image upload failed: ${err.error || uploadRes.status}`);
          setIsSubmitting(false);
          return;
        }
        const uploadData = await uploadRes.json();
        coverImageUrl = uploadData.url;
      }

      // Step 1b: Upload inline images
      const inlineInput = document.querySelector('input[name="inlineImages"]') as HTMLInputElement;
      const uploadedInlineUrls: string[] = [];
      if (inlineInput && inlineInput.files && inlineInput.files.length > 0) {
        for (const file of Array.from(inlineInput.files)) {
          const uploadForm = new FormData();
          uploadForm.append("file", file);
          uploadForm.append("folder", "inline_images");
          const res = await fetch("/api/upload", { method: "POST", body: uploadForm });
          if (res.ok) {
            const data = await res.json();
            uploadedInlineUrls.push(data.url);
          }
        }
      }

      // Step 2: Submit article text data + image URL (not the file) via server action
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("subtitle", formData.subtitle);
      fd.append("section", formData.section);
      fd.append("tags", formData.tags);
      fd.append("abstract", formData.abstract);
      fd.append("readTime", formData.readTime);
      fd.append("publicationPreference", formData.publicationPreference);
      fd.append("body", formData.body);
      fd.append("acknowledgements", formData.acknowledgements);

      if (selectedAuthorId) fd.append("primaryAuthorId", selectedAuthorId.toString());
      selectedCoAuthors.forEach(ca => fd.append("coAuthorIds", ca.id.toString()));

      if (coverImageUrl) {
        fd.append("coverImageUrl", coverImageUrl);
        fd.append("captions", formData.captions);
        fd.append("altText", formData.altText);
        fd.append("mediaCredits", formData.mediaCredits);
      }

      // Pass inline image URLs to the server action
      uploadedInlineUrls.forEach(url => fd.append("inlineImageUrls", url));

      const result = await submitArticleAction(fd);


      if (!result.success) {
        setError(result.error || "Failed to submit article");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Article submitted successfully!");
      setInlineImageUrls(uploadedInlineUrls);
      setFormData({
        primaryAuthor: "", coAuthors: "", title: "", subtitle: "", section: "Technical", tags: "", abstract: "",
        readTime: "", publicationPreference: "Flexible", body: "", captions: "", altText: "", mediaCredits: "", acknowledgements: "",
      });
      setSelectedAuthorId(null);
      setAuthorQuery('');
      setSelectedCoAuthors([]);
      setCoAuthorQuery('');
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
          <div className="p-5 bg-green-50 border border-green-200 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <p className="font-semibold text-green-800 text-base">{successMessage}</p>
            </div>

            {inlineImageUrls.length > 0 && (
              <div className="border-t border-green-200 pt-4 space-y-3">
                <p className="font-semibold text-green-800">Your inline images were uploaded successfully!</p>
                <p className="text-green-700 text-sm">
                  Each image below has been saved to the cloud. To embed an image <strong>inside your article body</strong>,
                  click <strong>Copy</strong> next to it, then paste that text wherever you want the image to appear in
                  the Article Body field. The format <code className="bg-green-100 px-1 rounded">![Image 1](url)</code> is
                  standard Markdown — the text inside <code className="bg-green-100 px-1 rounded">[]</code> is the image
                  description, and the text inside <code className="bg-green-100 px-1 rounded">()</code> is the link to
                  the image. You can change the description to anything you like.
                </p>
                <div className="space-y-2">
                  {inlineImageUrls.map((url, i) => (
                    <div key={i} className="bg-white border border-green-200 rounded-md p-3">
                      <p className="text-xs text-green-600 font-medium mb-1">Image {i + 1} — click Copy, then paste into the Article Body</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-green-50 px-2 py-1 rounded text-xs break-all text-green-900">{`![Image ${i + 1}](${url})`}</code>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(`![Image ${i + 1}](${url})`)}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 shrink-0 font-medium"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            
            <div ref={coAuthorRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Co-Authors</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCoAuthors.map(ca => (
                  <span key={ca.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {ca.full_name}
                    <button type="button" onClick={() => setSelectedCoAuthors(prev => prev.filter(p => p.id !== ca.id))} className="ml-2 text-indigo-500 hover:text-indigo-900 focus:outline-none">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search to add co-authors..."
                value={coAuthorQuery}
                onChange={e => { setCoAuthorQuery(e.target.value); setShowCoAuthorSuggestions(true); }}
                onFocus={() => setShowCoAuthorSuggestions(true)}
                className="block w-full rounded-md p-3 border border-gray-300"
              />
              {showCoAuthorSuggestions && coAuthorSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {coAuthorSuggestions.map(author => (
                    <li
                      key={author.id}
                      onMouseDown={() => {
                        setSelectedCoAuthors(prev => [...prev, author]);
                        setCoAuthorQuery('');
                        setShowCoAuthorSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      <span className="font-medium">{author.full_name}</span>
                      <span className="text-gray-400 ml-2">{author.email}</span>
                    </li>
                  ))}
                </ul>
              )}
              {showCoAuthorSuggestions && coAuthorQuery.length > 0 && coAuthorSuggestions.length === 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 px-4 py-2 text-sm text-gray-400">
                  No authors found.
                </div>
              )}
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">External/Unregistered Co-authors</label>
              <textarea name="coAuthors" value={formData.coAuthors} onChange={handleChange} placeholder="If your co-author has not registered on this platform, type their Name + Class Year + Email here." rows={2} className="block w-full rounded-md p-3 border border-gray-300 bg-gray-50 text-gray-700" />
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
                <option value="humor">Humor</option>
                <option value="news">News</option>
                <option value="opinion">Opinions/Commentary</option>
                <option value="spotlight">Spotlights/Interviews</option>
                <option value="technical">Technical</option>
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
