"use client";

import { SortOption } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) 
  {
  const { language } = useLanguage();
  const t = translations[language];

  const options: { value: SortOption; label: string }[] = [
    { value: "newest", label: t.newestFirst },
    { value: "oldest", label: t.oldestFirst },
    { value: "rating", label: t.highestRated },
    { value: "title", label: t.aToZ },
  ];
  return (
    <div className="relative flex-shrink-0">
      <SlidersHorizontal
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="pl-8 pr-8 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
