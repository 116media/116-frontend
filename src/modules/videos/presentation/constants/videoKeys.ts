/**
 * Stable TanStack Query keys for the videos feature. `similar` and `popular`
 * are keyed by the open video so each video's exclusion set caches
 * independently; `myPlaylists` backs the add-to-playlist modal.
 */
export const videoKeys = {
    all: ["videos"] as const,
    detail: (slug: string) => [...videoKeys.all, "detail", slug] as const,
    lyrics: (videoId: string) => [...videoKeys.all, "detail", videoId, "lyrics"] as const,
    similar: (videoId: string) => [...videoKeys.all, "similar", videoId] as const,
    popular: (videoId: string) => [...videoKeys.all, "popular", videoId] as const,
    youtubeStats: (youtubeId: string) => [...videoKeys.all, "youtube", youtubeId] as const,
    myPlaylists: ["videos", "playlists", "mine"] as const
};

/**
 * Page size for the infinite-scrolling similar-videos grid — how many cards
 * each page of `getPublishedVideos` (or its dummy fill) contributes.
 */
export const SIMILAR_VIDEOS_PAGE_SIZE = 6;

/**
 * Maximum number of rows the popular-videos sidebar shows. The popular endpoint
 * is fixed-size (not paginated), so this is both the requested `limit` and the
 * size of the dummy fallback pool.
 */
export const POPULAR_VIDEOS_LIMIT = 10;
