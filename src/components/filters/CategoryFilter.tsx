"use client";

import { motion } from "framer-motion";
import { Category } from "@/types";
import { CATEGORIES } from "@/lib/mockData";
import { getCategoryIcon, cn } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

interface CategoryFilterProps {
  value: Category | "All";
  onChange: (category: Category | "All") => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
const { language } = useLanguage();
const t = translations[language];
const categoryLabels: Record<string, string> = {
  All: t.all,
  Architecture: t.architecture,
  Art: t.art,
  Music: t.music,
  Literature: t.literature,
  Cuisine: t.cuisine,
  Traditions: t.traditions,
  Crafts: t.crafts,
  Dance: t.dance,
};
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const active = value === cat;
        return (
          <motion.button
            key={categoryLabels[cat] || cat}
            onClick={() => onChange(cat as Category | "All")}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-secondary text-secondary-foreground border-transparent hover:border-border hover:bg-secondary/70"
            )}
          >
            {cat !== "All" && <span className="text-xs">{getCategoryIcon(cat)}</span>}
            {categoryLabels[cat] || cat}
          </motion.button>
        );
      })}
    </div>
  );
}
