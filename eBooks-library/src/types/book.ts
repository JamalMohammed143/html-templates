
export interface Person {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

export interface BookFormats {
  [mimeType: string]: string;
}

export interface Book {
  id: number;
  title: string;
  authors: Person[];
  translators: Person[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean | null;
  media_type: string;
  formats: BookFormats;
  download_count: number;
  summaries?: string[];
}

export interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}
