import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { t } from "../config/i18n";
import { useInfiniteBooks } from "../hooks/useInfiniteBooks";
import BookCard from "../components/BookCard";
import { SearchIcon } from "lucide-react";
import PatternBg from "../assets/Pattern.svg";

const SEARCH_DEBOUNCE_MS = 500;

export function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = searchParams.get("topic") ?? "Fiction";
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { books, loading, loadingMore, error, hasMore, loadMore } = useInfiniteBooks({
    topic,
    search,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback((url: string) => {
    window.open(url, "_blank", "noopener, noreferrer");
  }, []);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchInput(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (v.trim()) next.set("search", v.trim());
            else next.delete("search");
            return next;
          },
          { replace: true }
        );
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearchParams]
  );

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Only trigger if intersecting, has more, and not currently loading
        if (entries[0]?.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore, loading, loadingMore]);

  return (
    <div className="min-h-scree"
      style={{
        backgroundImage: `url(${PatternBg})`,
        backgroundRepeat: "repeat",
      }}>
      <header className="sticky top-0 z-10 bg-white/60 shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="text-sm font-medium text-black hover:underline"
            >
              ← {t("books.back")}
            </Link>
            <div className="flex-1 sm:max-w-xs relative">
              <SearchIcon className="h-4 w-4 text-grey-medium absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchInput}
                onChange={handleSearch}
                placeholder={t("books.search.placeholder")}
                className="w-full rounded-sm border border-grey-light bg-gray-100 px-2.5 py-2.5 pl-8 text-sm placeholder:text-grey-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <h2 className="mt-2 font-serif text-lg font-semibold text-primary">
            {topic}
          </h2>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <p className="py-8 text-center text-grey-medium">
            {t("books.loading")}
          </p>
        ) : books.length === 0 ? (
          <p className="py-8 text-center text-grey-medium">
            {t("books.empty")}
          </p>
        ) : (
          <ul className="space-y-4">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} onOpen={handleOpen} />
              </li>
            ))}
          </ul>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-4" aria-hidden />
      </main>
    </div>
  );
}
