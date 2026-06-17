import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Architecture: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    Art: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    Music: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    Literature: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    Cuisine: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Traditions: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    Crafts: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    Dance: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Architecture: "🏛️",
    Art: "🎨",
    Music: "🎵",
    Literature: "📚",
    Cuisine: "🍜",
    Traditions: "🎭",
    Crafts: "🧵",
    Dance: "💃",
  };
  return icons[category] || "✨";
}

export function generateStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}
