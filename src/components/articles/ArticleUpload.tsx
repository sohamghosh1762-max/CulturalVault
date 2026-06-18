"use client";

import { useEffect, useState } from "react";

export default function ArticleUpload() {
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
    const editArticle =
      localStorage.getItem("editArticle");

    if (editArticle) {
      setArticle(JSON.parse(editArticle));
    }
  }, []);

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

      localStorage.removeItem(
        "editArticle"
      );

      window.dispatchEvent(
        new Event("articlesUpdated")
      );

      alert("Article Updated Successfully");
    } else {
      articles.push({
        ...article,
        id: Date.now(),
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

        <input
          type="file"
          accept="image/*"
          className="border rounded-xl p-3"
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
      </div>

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

      <button
        onClick={saveArticle}
        className="mt-5 bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90"
      >
        {article.id
          ? "Update Article"
          : "Publish Article"}
      </button>
    </div>
  );
}