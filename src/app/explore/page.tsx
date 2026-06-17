"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { FilterState, Category, SortOption } from "@/types";
import { useItems } from "@/hooks";
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
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(filters.search, 350);
  const { language } = useLanguage();
  const t = translations[language];

  const activeFilters = { ...filters, search: debouncedSearch };
  const { items, loading, error, total } = useItems(activeFilters, page);

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
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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
            {total === 0
              ? t.noItems
              : `${t.showing} ${Math.min((page - 1) * ITEMS_PER_PAGE + 1, total)}–${Math.min(page * ITEMS_PER_PAGE, total)} ${t.of} ${total} ${t.items}`}
            {debouncedSearch && (
              <span className="ml-1">
                {t.for} <span className="text-foreground font-medium">"{debouncedSearch}"</span>
              </span>
            )}
          </motion.p>
        )}

        <ItemGrid items={items} loading={loading} error={error} />

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
