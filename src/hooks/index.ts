import { useState, useEffect, useCallback, useRef } from "react";
import { CulturalItem, FilterState } from "@/types";
import { itemsService } from "@/services/itemsService";

// ─── useItems ────────────────────────────────────────────────────────────────
export function useItems(filters: Partial<FilterState> = {}, page = 1) {
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await itemsService.getItems(filters, page);
    if (res.error) {
      setError(res.error);
    } else {
      setItems(res.data);
      setTotal(res.pagination?.total ?? 0);
    }
    setLoading(false);
  }, [JSON.stringify(filters), page]); // eslint-disable-line

  useEffect(() => { fetch(); }, [fetch]);

  return { items, loading, error, total, refetch: fetch };
}

// ─── useItem ─────────────────────────────────────────────────────────────────
export function useItem(id: string) {
  const [item, setItem] = useState<CulturalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // Try to find the item in local storage articles
    let localArticles: any[] = [];
    if (typeof window !== "undefined") {
      try {
        localArticles = JSON.parse(localStorage.getItem("articles") || "[]");
      } catch (err) {
        console.error(err);
      }
    }
    const foundArticle = localArticles.find((a: any) => String(a.id) === id);

    if (foundArticle) {
      // Increment views
      const incrementedViews = (foundArticle.views || 0) + 1;
      const updatedArticles = localArticles.map((a: any) => {
        if (String(a.id) === id) {
          return { ...a, views: incrementedViews };
        }
        return a;
      });
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
      window.dispatchEvent(new Event("articlesUpdated"));

      setItem({
        id: String(foundArticle.id),
        title: foundArticle.title,
        description: foundArticle.shortDescription || foundArticle.content || "",
        longDescription: foundArticle.content || "",
        category: "Articles",
        tags: foundArticle.tags || [],
        imageUrl: foundArticle.image || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
        location: foundArticle.region || "Global",
        era: "Contemporary",
        rating: 4.5,
        reviewCount: 0,
        featured: false,
        createdAt: foundArticle.createdAt || new Date().toISOString(),
        views: incrementedViews,
        likes: foundArticle.likes || 0,
        contentType: "Articles",
        artifacts: [],
        curator: { name: "Author", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", title: "Contributor" }
      });
      setLoading(false);
    } else {
      itemsService.getItemById(id).then((res) => {
        if (res.error) setError(res.error);
        else setItem(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  const likeItem = useCallback(() => {
    if (!item || item.category !== "Articles") return;
    let localArticles: any[] = [];
    if (typeof window !== "undefined") {
      try {
        localArticles = JSON.parse(localStorage.getItem("articles") || "[]");
      } catch (err) {
        console.error(err);
      }
    }
    const updatedArticles = localArticles.map((a: any) => {
      if (String(a.id) === item.id) {
        return { ...a, likes: (a.likes || 0) + 1 };
      }
      return a;
    });
    localStorage.setItem("articles", JSON.stringify(updatedArticles));
    window.dispatchEvent(new Event("articlesUpdated"));

    setItem((prev) => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
  }, [item]);

  return { item, loading, error, likeItem };
}

// ─── useFeaturedItems ─────────────────────────────────────────────────────────
export function useFeaturedItems() {
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemsService.getFeaturedItems().then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  return { items, loading };
}

// ─── useRelatedItems ──────────────────────────────────────────────────────────
export function useRelatedItems(id: string, category: string) {
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !category) return;
    itemsService.getRelatedItems(id, category).then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, [id, category]);

  return { items, loading };
}

// ─── useIntersectionObserver ──────────────────────────────────────────────────
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isIntersecting };
}
