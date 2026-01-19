export const defaultLocale = "en" as const;

export const translations: Record<string, Record<string, string>> = {
  en: {
    "app.title": "Gutenberg Project",
    "app.tagline": "A social cataloging website that allows you to freely search its database of books, annotations, and reviews.",
    "home.subtitle": "Choose a category to explore",
    "books.back": "Back to categories",
    "books.search.placeholder": "Search by title or author...",
    "books.loading": "Loading…",
    "books.loadMore": "Load more",
    "books.empty": "No books found.",
    "books.error.viewable": "No viewable version available",
    "book.downloads": "downloads",
  },
};

export function t(key: string, locale: string = defaultLocale): string {
  return translations[locale]?.[key] ?? key;
}
