"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, Trash2 } from "lucide-react";
import { useBookmarks } from "@/context/BookmarksContext";
import { CulturalItem } from "@/types";
import { itemsService } from "@/services/itemsService";
import { ItemCard } from "@/components/cards/ItemCard";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import React from "react";

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks } = useBookmarks(); // bookmarks = array of ids
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchBookmarked() {
      setLoading(true);
      try {
        const results = await Promise.all(bookmarks.map((id) => itemsService.getItemById(id)));
        if (!mounted) return;
        setItems(results.flatMap((r) => (r.data ? [r.data] : [])));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchBookmarked();
    return () => {
      mounted = false;
    };
  }, [bookmarks]);

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Bookmark className="text-primary" />
            My Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            {bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={clearBookmarks}
            className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: Math.max(bookmarks.length, 2) }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">🏺</div>
          <h2 className="font-display text-2xl font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring and bookmark items you find fascinating.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Now
          </a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
