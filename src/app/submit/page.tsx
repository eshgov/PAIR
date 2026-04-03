"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArticleSubmissionForm() {
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

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulated auth check: verify if the user is logged in as an author
    const isAuthorLoggedIn = localStorage.getItem("isAuthorLoggedIn") === "true";
    if (!isAuthorLoggedIn) {
      router.push("/login?error=unauthorized_author");
    } else {
      setIsAuthorized(true);
      // Pre-fill primary author if we have their name stored
      const authorName = localStorage.getItem("authorName");
      if (authorName) {
        setFormData((prev) => ({ ...prev, primaryAuthor: authorName }));
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Article submitted successfully (Simulated)");
    console.log("Form Data Submitted:", formData);
  };

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Verifying authorization...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 px-8 text-white">
          <h1 className="text-3xl font-bold">Submit an Article</h1>
          <p className="mt-2 text-purple-100">Share your thoughts, research, and stories with the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-10 space-y-10">
          {/* 1. Author Selection */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">1. Author Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Author</label>
                <input
                  type="text"
                  name="primaryAuthor"
                  value={formData.primaryAuthor}
                  onChange={handleChange}
                  placeholder="Search author database..."
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Co-authors</label>
                <textarea
                  name="coAuthors"
                  value={formData.coAuthors}
                  onChange={handleChange}
                  placeholder="Internal tags/names or External: Name + Class Year + Email"
                  rows={2}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* 2. Article Metadata */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">2. Article Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-lg p-3 border border-gray-300"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="block w-full text-gray-800 outline-none rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300 bg-white"
                >
                  <option>Technical</option>
                  <option>Opinion</option>
                  <option>Creative</option>
                  <option>Interview</option>
                  <option>Humor</option>
                  <option>Spotlight</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication Preference</label>
                <select
                  name="publicationPreference"
                  value={formData.publicationPreference}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300 bg-white"
                >
                  <option>ASAP</option>
                  <option>Next Issue</option>
                  <option>Flexible</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags / Keywords (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Abstract / Summary (2-3 sentences)</label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Read Time (minutes)</label>
                <input
                  type="number"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* 3. Article Content */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">3. Article Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Body (Markdown Supported)</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={12}
                className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300 font-mono bg-gray-50"
                placeholder="Write your article here..."
                required
              />
            </div>
          </section>

          {/* 4. Media & Assets */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">4. Media & Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inline Images</label>
                <input
                  type="file"
                  name="inlineImages"
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Captions</label>
                <textarea
                  name="captions"
                  value={formData.captions}
                  onChange={handleChange}
                  rows={2}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text for Accessibility</label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Credits / Sources</label>
                <input
                  type="text"
                  name="mediaCredits"
                  value={formData.mediaCredits}
                  onChange={handleChange}
                  className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* 5. Collaboration & Credits */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">5. Collaboration & Credits</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acknowledgements (optional)</label>
              <textarea
                name="acknowledgements"
                value={formData.acknowledgements}
                onChange={handleChange}
                rows={3}
                placeholder="Anyone you'd like to thank?"
                className="block w-full rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm p-3 border border-gray-300"
              />
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Submit Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
