import { useState, useCallback, useEffect } from "react";
import { fetchBooks } from "../api/fetchBooks";
import type { Book } from "../types/book";

export interface UseInfiniteBooksOptions {
  topic: string;
  search: string;
}

export interface UseInfiniteBooksResult {
  books: Book[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}


export function useInfiniteBooks({
  topic,
  search,
}: UseInfiniteBooksOptions): UseInfiniteBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPage = useCallback(
    async (pageUrl?: string | null) => {
      try {
        const res = await fetchBooks({
          topic,
          search: search || undefined,
          page: pageUrl ?? undefined,
        });
        return res;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to fetch books";
        setError(msg);
        return null;
      }
    },
    [topic, search]
  );

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    setBooks([]);
    setNextUrl(null);
    fetchPage(null).then((res) => {
      setLoading(false);
      if (res) {
        setBooks(res.results);
        setNextUrl(res.next);
      }
    });
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!nextUrl || isLoadingMore) return;
    setIsLoadingMore(true);
    fetchPage(nextUrl).then((res) => {
      setIsLoadingMore(false);
      if (res) {
        setBooks((prev) => [...prev, ...res.results]);
        setNextUrl(res.next);
      }
    });
  }, [nextUrl, isLoadingMore, fetchPage]);

  // Initial load and when topic or search changes
  useEffect(() => {
    const load = async () => {
      await loadInitial();
    };
    load();
  }, [loadInitial]);

  const hasMore = !!nextUrl;

  return {
    books,
    loading,
    loadingMore: isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh: loadInitial,
  };
}
