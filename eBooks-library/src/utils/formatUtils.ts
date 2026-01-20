/** MIME types we treat as viewable */
const VIEWABLE_PRIORITY: readonly string[] = [
  "text/html",
  "text/html; charset=utf-8",
  "text/html; charset=us-ascii",
  "text/html; charset=iso-8859-1",
  "application/pdf",
  "text/plain",
  "text/plain; charset=utf-8",
  "text/plain; charset=us-ascii",
  "text/plain; charset=iso-8859-1",
];


export function isViewableMime(mime: string): boolean {
  const lower = mime.toLowerCase();
  return VIEWABLE_PRIORITY.some((p) => lower.startsWith(p.split(";")[0].trim()));
}

export function getViewableBookUrl(formats: Record<string, string>): string | null {
  if (!formats) return null;

  // Check formats in priority order
  for (const preferredMime of VIEWABLE_PRIORITY) {
    const baseMime = preferredMime.split(";")[0].trim().toLowerCase();
    for (const [mime, url] of Object.entries(formats)) {
      if (url && mime.toLowerCase().startsWith(baseMime)) {
        return url;
      }
    }
  }

  return null;
}
