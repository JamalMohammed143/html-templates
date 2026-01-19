/* Gutendex API base URL */
export const API_BASE_URL = "http://skunkworks.ignitesol.com:8000";

/* Book categories used for the topic parameter. */

export const BOOK_CATEGORIES = [
  "Fiction",
  "Drama",
  "Humor",
  "Politics",
  "Philosophy",
  "History",
  "Adventure",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
