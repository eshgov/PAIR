"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";

export default function ArticleSubmissionForm() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthorLoggedIn = localStorage.getItem("isAuthorLoggedIn") === "true";
    if (!isAuthorLoggedIn) {
      router.push("/login?error=unauthorized_author");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Verifying authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <ArticleForm />
    </div>
  );
}
