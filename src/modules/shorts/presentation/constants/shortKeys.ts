/**
 * Stable TanStack Query keys for the shorts feature. The feed key backs the
 * shared "for you" cursor feed (strip + player); `detail` keys a by-slug short
 * for a future deep-link route.
 */
export const shortKeys = {
    all: ["shorts"] as const,
    feed: () => [...shortKeys.all, "feed"] as const,
    detail: (slug: string) => [...shortKeys.all, "detail", slug] as const
};

/**
 * Page size for the shorts "for you" feed (strip + player share one infinite query).
 */
export const SHORTS_PAGE_SIZE = 10;
