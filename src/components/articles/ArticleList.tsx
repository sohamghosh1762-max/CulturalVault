"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

export default function ArticleList({
  onEditArticle,
}: {
  onEditArticle: (article: any) => void;
}) {
  const [articles, setArticles] = useState<any[]>([]);

  const loadArticles = () => {
    const storedArticles = JSON.parse(
      localStorage.getItem("articles") || "[]"
    );

    setArticles(storedArticles);
  };

  useEffect(() => {
    loadArticles();

    const refreshArticles = () => {
      loadArticles();
    };

    window.addEventListener(
      "articlesUpdated",
      refreshArticles
    );

    return () => {
      window.removeEventListener(
        "articlesUpdated",
        refreshArticles
      );
    };
  }, []);

  const deleteArticle = (id: number) => {
    const updatedArticles = articles.filter(
      (article) => article.id !== id
    );

    localStorage.setItem(
      "articles",
      JSON.stringify(updatedArticles)
    );

    setArticles(updatedArticles);

    window.dispatchEvent(
      new Event("articlesUpdated")
    );

    alert("Article Deleted Successfully");
  };

  const editArticle = (article: any) => {
    onEditArticle(article);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          Uploaded Blog Section
        </h2>

        <span className="text-muted-foreground">
          {articles.length} Articles
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="border rounded-2xl p-10 text-center bg-card">
          <h3 className="text-xl font-semibold mb-2">
            No Articles Published
          </h3>

          <p className="text-muted-foreground">
            Publish your first heritage article.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={deleteArticle}
              onEdit={editArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
}