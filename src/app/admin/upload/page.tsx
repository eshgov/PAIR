"use client";

import React, { useState } from "react";

const CATEGORIES = ["News", "Technical", "Opinion", "Spotlights", "Humor", "Games"];

interface ArticleForm {
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  category: string;
  tags: string;
  body: string;
  imageUrl: string;
  imageCaption: string;
  publishDate: string;
  status: "draft" | "published";
}

const EMPTY_FORM: ArticleForm = {
  title: "",
  subtitle: "",
  author: "",
  authorBio: "",
  category: CATEGORIES[0],
  tags: "",
  body: "",
  imageUrl: "",
  imageCaption: "",
  publishDate: new Date().toISOString().split("T")[0],
  status: "draft",
};

export default function UploadArticle() {
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const wordCount = form.body.trim() ? form.body.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "body") setCharCount(value.length);
  }

  function handleSubmit(e: React.FormEvent, status: "draft" | "published") {
    e.preventDefault();
    setForm((prev) => ({ ...prev, status }));
    console.log("Article submitted:", { ...form, status });
    setSubmitted(true);
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setCharCount(0);
    setSubmitted(false);
    setPreview(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center space-y-4">
          <div className="text-4xl">✓</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Article {form.status === "published" ? "Published" : "Saved as Draft"}!
          </h2>
          <p className="text-gray-600 text-sm">
            <strong>{form.title}</strong> by {form.author} has been{" "}
            {form.status === "published" ? "published" : "saved as a draft"}.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleReset}
              className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Upload Another Article
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Edit This Article
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Preview Mode</h2>
          <button
            onClick={() => setPreview(false)}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Editor
          </button>
        </div>

        {form.imageUrl && (
          <div className="bg-gray-100 aspect-video mb-6 w-full flex items-center justify-center text-gray-400 text-sm rounded">
            [Cover image: {form.imageUrl}]
            {form.imageCaption && (
              <span className="block text-xs mt-1 text-gray-400">{form.imageCaption}</span>
            )}
          </div>
        )}

        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            {form.category}
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight mb-3">{form.title || "Untitled"}</h1>
        {form.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{form.subtitle}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-4 mb-6">
          <span>By <strong className="text-gray-900">{form.author || "Unknown"}</strong></span>
          <span>·</span>
          <span>{form.publishDate}</span>
          <span>·</span>
          <span>{readTime} min read</span>
          <span>·</span>
          <span>{wordCount} words</span>
        </div>

        {form.authorBio && (
          <blockquote className="border-l-4 border-gray-200 pl-4 text-sm text-gray-500 italic mb-6">
            {form.authorBio}
          </blockquote>
        )}

        <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
          {form.body || <span className="text-gray-400 italic">No body content yet.</span>}
        </div>

        {form.tags && (
          <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
            {form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Upload Article</h1>
          <p className="text-sm text-gray-500 mt-1">Admin — Testing Mode</p>
        </div>
        <button
          onClick={() => setPreview(true)}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Preview
        </button>
      </div>

      <form className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Enter article title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-lg font-bold focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Dek</label>
          <input
            name="subtitle"
            type="text"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="A short description shown under the title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Author + Category row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              name="author"
              type="text"
              required
              value={form.author}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Author Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
          <input
            name="authorBio"
            type="text"
            value={form.authorBio}
            onChange={handleChange}
            placeholder="Short bio displayed with the article"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input
            name="imageUrl"
            type="text"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Image Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image Caption</label>
          <input
            name="imageCaption"
            type="text"
            value={form.imageCaption}
            onChange={handleChange}
            placeholder="Photo credit or caption"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Body <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-gray-400">
              {wordCount} words · ~{readTime} min read · {charCount} chars
            </span>
          </div>
          <textarea
            name="body"
            required
            value={form.body}
            onChange={handleChange}
            rows={18}
            placeholder="Write your article here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black resize-y font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Tags + Date row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="AI, machine learning, ethics (comma-separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
            <input
              name="publishDate"
              type="date"
              value={form.publishDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
        </div>

        {/* Tags preview */}
        {form.tags && (
          <div className="flex flex-wrap gap-2">
            {form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "draft")}
            className="px-4 py-2 border border-black text-black rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, "published")}
            className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Publish
          </button>
        </div>

      </form>
    </div>
  );
}
