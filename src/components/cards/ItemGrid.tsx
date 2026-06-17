"use client";

import { AnimatePresence } from "framer-motion";
import { CulturalItem } from "@/types";
import { ItemCard } from "./ItemCard";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

interface ItemGridProps {
  items: CulturalItem[];
  loading: boolean;
  error: string | null;
}

export function ItemGrid({ items, loading, error }: ItemGridProps) {
  if (error) return <ErrorState message={error} />;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      id="explore"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
