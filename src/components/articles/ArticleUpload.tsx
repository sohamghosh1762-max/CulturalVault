"use client";

import { useEffect, useState } from "react";

export default function ArticleUpload({
  editingArticle,
  setEditingArticle,
}: {
  editingArticle: any;
  setEditingArticle: (article: any) => void;
}) {
  const [article, setArticle] = useState({
    id: null as number | null,
    title: "",
    category: "",
    region: "",
    threat: "Safe",
    score: "",
    image: "",
    shortDescription: "",
    content: "",
  });

  useEffect(() => {
    if (editingArticle) {
      setArticle({
        id: editingArticle.id || null,
        title: editingArticle.title || "",
        category: editingArticle.category || "",
        region: editingArticle.region || "",
        threat: editingArticle.threat || "Safe",
        score: String(editingArticle.score || ""),
        image: editingArticle.image || "",
        shortDescription: editingArticle.shortDescription || "",
        content: editingArticle.content || "",
      });
    } else {
      setArticle({
        id: null,
        title: "",
        category: "",
        region: "",
        threat: "Safe",
        score: "",
        image: "",
        shortDescription: "",
        content: "",
      });
    }
  }, [editingArticle]);

  const saveArticle = () => {
    if (
      !article.title ||
      !article.category ||
      !article.region
    ) {
      alert("Please fill all required fields");
      return;
    }

    const articles = JSON.parse(
      localStorage.getItem("articles") || "[]"
    );

    if (article.id) {
      const updatedArticles = articles.map(
        (a: any) =>
          a.id === article.id ? article : a
      );

      localStorage.setItem(
        "articles",
        JSON.stringify(updatedArticles)
      );

      window.dispatchEvent(
        new Event("articlesUpdated")
      );

      alert("Article Updated Successfully");
      setEditingArticle(null);
    } else {
      articles.push({
        ...article,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      });

      localStorage.setItem(
        "articles",
        JSON.stringify(articles)
      );

      window.dispatchEvent(
        new Event("articlesUpdated")
      );

      alert("Article Published Successfully");
    }

    setArticle({
      id: null,
      title: "",
      category: "",
      region: "",
      threat: "Safe",
      score: "",
      image: "",
      shortDescription: "",
      content: "",
    });
  };

  return (
    <div className="border rounded-2xl p-6 bg-card">
      <h2 className="text-3xl font-bold mb-6">
        🏛 Heritage Knowledge Hub
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Article Title"
          value={article.title}
          onChange={(e) =>
            setArticle({
              ...article,
              title: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Category"
          value={article.category}
          onChange={(e) =>
            setArticle({
              ...article,
              category: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <input
          placeholder="Region"
          value={article.region}
          onChange={(e) =>
            setArticle({
              ...article,
              region: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <select
          value={article.threat}
          onChange={(e) =>
            setArticle({
              ...article,
              threat: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        >
          <option>Safe</option>
          <option>Vulnerable</option>
          <option>Endangered</option>
        </select>

        <input
          type="number"
          placeholder="Preservation Score (0-100)"
          value={article.score}
          onChange={(e) =>
            setArticle({
              ...article,
              score: e.target.value,
            })
          }
          className="border rounded-xl p-3"
        />

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="border rounded-xl p-3 w-full"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                const reader =
                  new FileReader();

                reader.onload = () => {
                  setArticle((prev) => ({
                    ...prev,
                    image:
                      reader.result as string,
                  }));
                };

                reader.readAsDataURL(file);
              }
            }}
          />
          {article.image && (
            <div className="text-xs text-muted-foreground">
              ✓ Cover image selected
            </div>
          )}
        </div>
      </div>

      {article.image && (
        <div className="mt-4 p-4 border rounded-2xl bg-muted/30">
          <p className="text-sm font-semibold mb-2 text-muted-foreground">
            Blog Cover Preview:
          </p>
          <img
            src={article.image}
            alt="Cover Preview"
            className="w-full max-h-60 object-cover rounded-xl border"
          />
        </div>
      )}

      <textarea
        placeholder="Short Description"
        value={article.shortDescription}
        onChange={(e) =>
          setArticle({
            ...article,
            shortDescription:
              e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mt-4"
        rows={3}
      />

      <textarea
        placeholder="Full Article"
        value={article.content}
        onChange={(e) =>
          setArticle({
            ...article,
            content: e.target.value,
          })
        }
        className="w-full border rounded-xl p-3 mt-4"
        rows={8}
      />

      <div className="flex gap-4 mt-5">
        <button
          onClick={saveArticle}
          className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold"
        >
          {article.id ? "Update Article" : "Publish Article"}
        </button>
        {article.id && (
          <button
            onClick={() => setEditingArticle(null)}
            className="bg-secondary text-foreground border border-border px-6 py-3 rounded-xl hover:bg-secondary/80 transition-all font-semibold"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </div>
  );
}