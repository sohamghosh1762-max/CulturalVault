"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function BookmarksPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Stories
        const storiesRes = await fetch("/api/stories");
        const storiesData = await storiesRes.json();

        // Contributions
        const contributionsRes = await fetch(
          "/api/contributions"
        );
        const contributionsData =
          await contributionsRes.json();

        // Articles (create later)
        let articlesData: any[] = [];

        try {
          const articlesRes = await fetch(
            "/api/articles"
          );
          articlesData =
            await articlesRes.json();
        } catch (error) {
          console.log(
            "Articles API not available yet"
          );
        }

        setStories(
          Array.isArray(storiesData)
            ? storiesData
            : []
        );

        setContributions(
          Array.isArray(contributionsData)
            ? contributionsData
            : []
        );

        setArticles(
          Array.isArray(articlesData)
            ? articlesData
            : []
        );

        const allItems = [
          ...(Array.isArray(storiesData)
            ? storiesData
            : []),
          ...(Array.isArray(contributionsData)
            ? contributionsData
            : []),
          ...(Array.isArray(articlesData)
            ? articlesData
            : []),
        ];

        if (allItems.length > 0) {
          setFeatured(allItems[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            📚 My Collection
          </h1>

          <p className="text-muted-foreground mt-3">
            Your personal archive of stories,
            articles and cultural heritage.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="border rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-orange-500">
              {stories.length}
            </h2>
            <p>Stories</p>
          </div>

          <div className="border rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-blue-500">
              {articles.length}
            </h2>
            <p>Articles</p>
          </div>

          <div className="border rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-green-500">
              {contributions.length}
            </h2>
            <p>Contributions</p>
          </div>

          <div className="border rounded-3xl p-6 text-center">
            <h2 className="text-4xl font-bold text-purple-500">
              {stories.length +
                articles.length +
                contributions.length}
            </h2>
            <p>Total Collection</p>
          </div>

        </div>

        {/* Stories */}
        <h2 className="text-3xl font-bold mb-6">
          📖 Stories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {stories.map((story) => (
            <div
              key={story._id}
              className="border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >

              {story.image && (
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">

                <h3 className="font-bold text-lg">
                  {story.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  📍 {story.region}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Articles */}
        <h2 className="text-3xl font-bold mt-14 mb-6">
          📰 Articles
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {articles.map((article) => (
            <div
              key={article._id}
              className="border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >

              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">

                <h3 className="font-bold text-lg">
                  {article.title}
                </h3>

              </div>

            </div>
          ))}

        </div>

        {/* Community Contributions */}
        <h2 className="text-3xl font-bold mt-14 mb-6">
          🏛 Community Contributions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {contributions.map(
            (contribution) => (
              <div
                key={contribution._id}
                className="border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >

                {contribution.image && (
                  <img
                    src={contribution.image}
                    alt={contribution.title}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-4">

                  <h3 className="font-bold text-lg">
                    {contribution.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-2">
                    📍 {contribution.region}
                  </p>

                  <div className="flex justify-between mt-4 text-sm">

                    <span>
                      ❤️ {contribution.likes || 0}
                    </span>

                    <span>
                      ⭐{" "}
                      {contribution.heritageScore ||
                        75}
                    </span>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>
    </PageWrapper>
  );
}