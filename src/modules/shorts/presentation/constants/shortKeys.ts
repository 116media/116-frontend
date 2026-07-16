/**
 * Stable TanStack Query keys for the shorts feature. The feed key backs the
 * shared randomized cursor feed (strip + player); `detail` keys a by-slug short
 * for a future deep-link route.
 */
export const shortKeys = {
    all: ["shorts"] as const,
    feed: () => [...shortKeys.all, "feed"] as const,
    detail: (slug: string) => [...shortKeys.all, "detail", slug] as const,
    favorites: {
        liked: ["shorts", "favorites", "liked"] as const,
        saved: ["shorts", "favorites", "saved"] as const,
        shared: ["shorts", "favorites", "shared"] as const
    }
};

/**
 * Page size for the shorts randomized feed (strip + player share one infinite query).
 */
export const SHORTS_PAGE_SIZE = 10;

/**
 * Page size for the shorts favorites grids (liked, saved, shared).
 */
export const SHORTS_FAVORITES_PAGE_SIZE = 12;
