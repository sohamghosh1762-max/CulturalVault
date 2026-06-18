"use client";

import { useState } from "react";
import ArticleUpload from "@/components/articles/ArticleUpload";
import ArticleList from "@/components/articles/ArticleList";

export default function ArticlesPage() {
  const [editingArticle, setEditingArticle] = useState<any>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ArticleUpload editingArticle={editingArticle} setEditingArticle={setEditingArticle} />

      <ArticleList onEditArticle={setEditingArticle} />
    </div>
  );
}