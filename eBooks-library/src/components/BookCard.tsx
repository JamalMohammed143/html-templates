
import type { Book } from "../types/book";
import { t } from "../config/i18n";
// import { getViewableBookUrl } from "../utils/formatUtils";

function getCoverUrl(formats: Record<string, string>): string | null {
    if (!formats) return null;
    const prefer = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const p of prefer) {
        for (const [mime, url] of Object.entries(formats)) {
            if (url && mime.toLowerCase().startsWith(p)) return url;
        }
    }
    return null;
}

function BookCard({
    book,
    onOpen,
}: {
    book: Book;
    onOpen: (url: string) => void;
}) {
    const viewable = book.formats[0];
    const cover = getCoverUrl(book.formats);
    const authors = book.authors?.map((a) => a.name).join(", ") || "—";

    const handleClick = () => {
        if (viewable) {
            onOpen(viewable);
        } else {
            alert(t("books.error.viewable"));
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex w-full gap-4 rounded-xl border border-grey-light bg-white p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
            <div className="h-24 w-16 shrink-0 overflow-hidden rounded-md bg-grey-light">
                {cover ? (
                    <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-grey-medium">
                        No cover
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="font-serif font-semibold text-primary line-clamp-2">
                    {book.title}
                </div>
                <div className="mt-1 text-sm text-grey-medium">
                    {authors}
                </div>
                <div className="mt-1 text-xs text-grey-medium">
                    {typeof book.download_count === "number" ? book.download_count.toLocaleString() : book.download_count}{" "}
                    {t("book.downloads")}
                </div>
            </div>
        </button>
    );
}

export default BookCard;