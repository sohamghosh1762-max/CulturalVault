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
    itemsService.getItemById(id).then((res) => {
      if (res.error) setError(res.error);
      else setItem(res.data);
      setLoading(false);
    });
  }, [id]);

  return { item, loading, error };
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
