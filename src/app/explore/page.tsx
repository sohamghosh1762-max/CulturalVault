"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { FilterState, Category, SortOption, CulturalItem } from "@/types";
import { HeroSection } from "@/components/layout/HeroSection";
import { SearchBar } from "@/components/search/SearchBar";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { SortSelect } from "@/components/filters/SortSelect";
import { ItemGrid } from "@/components/cards/ItemGrid";
import { Pagination } from "@/components/ui/Pagination";
import { StatsBar } from "@/components/layout/StatsBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "All",
  sortBy: "newest",
  era: "All Eras",
  contentType: "All",
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(filters.search, 350);
  const { language } = useLanguage();
  const t = translations[language];

  const [combinedItems, setCombinedItems] = useState<CulturalItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all items (Mock + DB Stories + LocalStorage Articles) and filter client side
  useEffect(() => {
    async function loadAllAndFilter() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Mock Items
        const mockRes = await fetch("/api/items?limit=100");
        if (!mockRes.ok) throw new Error("Failed to fetch heritage items.");
        const mockJson = await mockRes.json();
        const mockData: CulturalItem[] = mockJson.data || [];

        // 2. Fetch Stories from MongoDB
        let storiesData: any[] = [];
        try {
          const storiesRes = await fetch("/api/stories");
          if (storiesRes.ok) {
            storiesData = await storiesRes.json();
          }
        } catch (err) {
          console.error("Error fetching stories:", err);
        }
        const mappedStories: CulturalItem[] = (Array.isArray(storiesData) ? storiesData : []).map((story: any) => ({
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

        // 3. Get Articles from LocalStorage
        let localArticles: any[] = [];
        if (typeof window !== "undefined") {
          try {
            localArticles = JSON.parse(localStorage.getItem("articles") || "[]");
          } catch (err) {
            console.error("Error reading local articles:", err);
          }
        }
        const mappedArticles: CulturalItem[] = localArticles.map((article: any) => ({
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

        // 4. Combine all
        let all = [...mockData, ...mappedStories, ...mappedArticles];

        // 5. Filter
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          all = all.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q) ||
              i.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (filters.category !== "All") {
          all = all.filter((i) => i.category === filters.category);
        }

        // 6. Sort
        switch (filters.sortBy) {
          case "newest":
            all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "oldest":
            all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case "rating":
            all.sort((a, b) => b.rating - a.rating);
            break;
          case "title":
            all.sort((a, b) => a.title.localeCompare(b.title));
            break;
        }

        setTotalItems(all.length);
        const start = (page - 1) * 8;
        const paginated = all.slice(start, start + 8);
        setCombinedItems(paginated);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load heritage items.");
      } finally {
        setLoading(false);
      }
    }
    loadAllAndFilter();
  }, [debouncedSearch, filters.category, filters.sortBy, page]);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search }));
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: Category | "All") => {
    setFilters((f) => ({ ...f, category }));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sortBy: SortOption) => {
    setFilters((f) => ({ ...f, sortBy }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <PageWrapper>
      <HeroSection />
      <StatsBar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 mb-8"
        >
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder={t.searchPlaceholder}
              className="flex-1"
            />
            <SortSelect value={filters.sortBy} onChange={handleSortChange} />
          </div>

          <CategoryFilter
            value={filters.category}
            onChange={handleCategoryChange}
          />
        </motion.div>

        {/* Results count */}
        {!loading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {totalItems === 0
              ? t.noItems
              : `${t.showing} ${Math.min((page - 1) * ITEMS_PER_PAGE + 1, totalItems)}–${Math.min(page * ITEMS_PER_PAGE, totalItems)} ${t.of} ${totalItems} ${t.items}`}
            {debouncedSearch && (
              <span className="ml-1">
                {t.for} <span className="text-foreground font-medium">"{debouncedSearch}"</span>
              </span>
            )}
          </motion.p>
        )}

        <ItemGrid items={combinedItems} loading={loading} error={error} />

        {!loading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </section>
    </PageWrapper>
  );
}
