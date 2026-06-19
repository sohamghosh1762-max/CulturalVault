"use client";

import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useBookmarks } from "@/context/BookmarksContext";
import { ItemCard } from "@/components/cards/ItemCard";
import { CulturalItem } from "@/types";
import { FolderHeart, BookOpen, FileText, Landmark } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const [loading, setLoading] = useState(true);
  const [bookmarkedStories, setBookmarkedStories] = useState<CulturalItem[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<CulturalItem[]>([]);
  const [bookmarkedHeritage, setBookmarkedHeritage] = useState<CulturalItem[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Fetch Heritage Items (Mock Items)
        let mockData: CulturalItem[] = [];
        try {
          const mockRes = await fetch("/api/items?limit=100");
          if (mockRes.ok) {
            const json = await mockRes.json();
            mockData = json.data || [];
          }
        } catch (err) {
          console.error("Failed to load heritage items", err);
        }

        // 2. Fetch Stories
        let storiesData: any[] = [];
        try {
          const storiesRes = await fetch("/api/stories");
          if (storiesRes.ok) {
            storiesData = await storiesRes.json();
          }
        } catch (err) {
          console.error("Failed to load stories", err);
        }

        // 3. LocalStorage Articles
        let articlesData: any[] = [];
        try {
          articlesData = JSON.parse(localStorage.getItem("articles") || "[]");
        } catch (err) {
          console.error("Failed to load articles", err);
        }

        // Map stories to CulturalItem interface
        const mappedStories: CulturalItem[] = storiesData.map((story: any) => ({
          id: story._id || story.id,
          title: story.title,
          description: story.description || "",
          longDescription: story.description || "",
          category: "Stories",
          tags: [story.language, story.region].filter(Boolean),
          imageUrl: story.image || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
          location: story.region,
          era: "Contemporary",
          rating: 4.8,
          reviewCount: 0,
          featured: false,
          createdAt: story.createdAt || new Date().toISOString(),
          views: story.views || 0,
          likes: story.likes || 0,
          contentType: "Stories",
          artifacts: [],
          curator: { name: story.userName || "Unknown Contributor", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", title: "Contributor" }
        }));

        // Map articles to CulturalItem interface
        const mappedArticles: CulturalItem[] = articlesData.map((article: any) => ({
          id: String(article.id),
          title: article.title,
          description: article.shortDescription || article.content || "",
          longDescription: article.content || "",
          category: "Articles",
          tags: article.tags || [],
          imageUrl: article.image || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
          location: article.region || "Global",
          era: "Contemporary",
          rating: 4.5,
          reviewCount: 0,
          featured: false,
          createdAt: article.createdAt || new Date().toISOString(),
          views: article.views || 0,
          likes: article.likes || 0,
          contentType: "Articles",
          artifacts: [],
          curator: { name: "Author", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", title: "Contributor" }
        }));

        // Filter based on bookmarks array
        setBookmarkedHeritage(mockData.filter(item => bookmarks.includes(item.id)));
        setBookmarkedStories(mappedStories.filter(item => bookmarks.includes(item.id)));
        setBookmarkedArticles(mappedArticles.filter(item => bookmarks.includes(item.id)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [bookmarks]);

  const totalCollectionCount = bookmarkedStories.length + bookmarkedArticles.length + bookmarkedHeritage.length;

  return (
    <PageWrapper className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-display flex items-center gap-3">
              📚 My Collection
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Your personalized archive of oral stories, articles, and bookmarked cultural heritage sites.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border rounded-2xl text-sm font-semibold self-start">
            <FolderHeart className="size-4" />
            <span>{totalCollectionCount} Items Saved</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your collection...</p>
          </div>
        ) : totalCollectionCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl p-6 bg-card text-center">
            <FolderHeart className="size-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-1">Your collection is empty</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Explore cultural heritage sites, read stories, and check out articles to save them here.
            </p>
            <a 
              href="/explore" 
              className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all text-sm"
            >
              Start Exploring
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. Heritage Sites & Items */}
            {bookmarkedHeritage.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-6 text-foreground border-b pb-2 border-border/50">
                  <Landmark className="size-5 text-amber-500" />
                  Heritage Sites & Items ({bookmarkedHeritage.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bookmarkedHeritage.map((item, idx) => (
                    <ItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Stories */}
            {bookmarkedStories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-6 text-foreground border-b pb-2 border-border/50">
                  <BookOpen className="size-5 text-orange-500" />
                  Preserved Stories ({bookmarkedStories.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bookmarkedStories.map((item, idx) => (
                    <ItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Articles */}
            {bookmarkedArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-6 text-foreground border-b pb-2 border-border/50">
                  <FileText className="size-5 text-blue-500" />
                  Knowledge Hub & Articles ({bookmarkedArticles.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bookmarkedArticles.map((item, idx) => (
                    <ItemCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </PageWrapper>
  );
}