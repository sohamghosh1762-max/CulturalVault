"use client";

import { useState, useEffect } from "react";
import ArticleUpload from "@/components/articles/ArticleUpload";
import ArticleList from "@/components/articles/ArticleList";
import { recordRecentlyViewed } from "@/utils";

export default function ArticlesPage() {
  const [editingArticle, setEditingArticle] = useState<any>(null);

  useEffect(() => {
    recordRecentlyViewed({
      type: "article",
      title: "Uploaded Blog Section / Knowledge Hub",
      path: "/articles"
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ArticleUpload editingArticle={editingArticle} setEditingArticle={setEditingArticle} />

      <ArticleList onEditArticle={setEditingArticle} />
    </div>
  );
}