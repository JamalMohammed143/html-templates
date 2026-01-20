import { API_BASE_URL } from "../config/constants";
import type { BooksResponse } from "../types/book";

export interface FetchBooksParams {
    topic: string;
    search?: string;
    page?: string | null;
}

export async function fetchBooks(params: FetchBooksParams): Promise<BooksResponse> {
    let url: URL;

    // If page is a full URL, use it directly; otherwise build the URL
    if (params.page && (params.page.startsWith("http://") || params.page.startsWith("https://"))) {
        url = new URL(params.page);
    } else {
        url = new URL(`${API_BASE_URL}/books`);
        url.searchParams.set("topic", params.topic);
        url.searchParams.set("mime_type", "image/");
        if (params.search && params.search.trim()) {
            url.searchParams.set("search", params.search.trim());
        }
        if (params.page) {
            url.searchParams.set("page", params.page);
        }
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`Gutendex API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<BooksResponse>;
}
