"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Star, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { CulturalItem } from "@/types";
import { useBookmarks } from "@/context/BookmarksContext";
import { getCategoryColor, getCategoryIcon, formatNumber, truncate } from "@/utils";

interface ItemCardProps {
  item: CulturalItem;
  index?: number;
}

export function ItemCard({ item, index = 0 }: ItemCardProps) {
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border card-hover"
    >
      {/* Image */}
      <Link href={`/item/${item.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Inside Picture Writing - Purpose & Topic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
             <span className="text-primary/90 text-[10px] font-bold tracking-widest uppercase mb-1.5 drop-shadow-md">
               Theme / Purpose
             </span>
             <p className="text-white text-xs font-medium leading-relaxed drop-shadow-lg line-clamp-3">
               {item.description}
             </p>
          </div>

          {bookmarked && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow z-20">
              Featured
            </div>
          )}
        </div>
      </Link>

      {/* Bookmark button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(item.id);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
      >
        {bookmarked ? (
          <BookmarkCheck size={14} className="text-amber-500" />
        ) : (
          <BookmarkPlus size={14} className="text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
            <span>{getCategoryIcon(item.category)}</span>
            {item.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            <span className="font-medium text-foreground">{item.rating}</span>
            <span>({formatNumber(item.reviewCount)})</span>
          </div>
        </div>

        <Link href={`/item/${item.id}`}>
          <h3 className="font-display font-semibold text-base mb-1.5 hover:text-primary transition-colors leading-snug">
            {item.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-xs leading-relaxed mb-3">
          {truncate(item.description, 90)}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={10} />
            {item.location}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{item.era.split(" ")[0]}</span>
        </div>
      </div>
    </motion.div>
  );
}
