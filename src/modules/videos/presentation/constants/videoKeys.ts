/**
 * IVideoFeedFilters
 *
 * @description
 * Filters that scope the videos browse feed. All fields are optional; when none
 * is set the query targets the full feed.
 *
 * @interface IVideoFeedFilters
 *
 * @property {string} [search] - Optional full-text search term
 * @property {string} [categoryId] - Optional category filter (UUID)
 * @property {string} [tagSlug] - Optional tag filter
 */
export interface IVideoFeedFilters {
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}

/**
 * Stable TanStack Query keys for the videos feature. The feed key embeds the
 * active filters so each filter combination caches independently; `similar`
 * and `popular` are keyed by the open video so each video's exclusion set
 * caches independently; `myPlaylists` backs the add-to-playlist modal.
 */
export const videoKeys = {
    all: ["videos"] as const,
    feed: (filters: IVideoFeedFilters = {}) => [...videoKeys.all, "feed", filters] as const,
    categories: ["videos", "categories"] as const,
    shows: ["videos", "shows"] as const,
    popularTags: ["videos", "tags", "popular"] as const,
    allTags: (search: string) => [...videoKeys.all, "tags", "all", search] as const,
    detail: (slug: string) => [...videoKeys.all, "detail", slug] as const,
    lyrics: (videoId: string) => [...videoKeys.all, "detail", videoId, "lyrics"] as const,
    similar: (videoId: string) => [...videoKeys.all, "similar", videoId] as const,
    popular: (videoId: string) => [...videoKeys.all, "popular", videoId] as const,
    youtubeStats: (youtubeId: string) => [...videoKeys.all, "youtube", youtubeId] as const,
    myPlaylists: ["videos", "playlists", "mine"] as const
};

/**
 * Page size for the videos browse feed grid.
 */
export const VIDEOS_PAGE_SIZE = 12;

/**
 * Maximum number of category chips shown inline in the browse toolbar; the
 * remaining categories are reachable through the "browse all shows" modal.
 */
export const VIDEO_BROWSE_CHIP_LIMIT = 6;

/**
 * Maximum number of video tags requested for the "All tags" popover; tags
 * beyond this count are reachable through the popover's search box.
 */
export const ALL_VIDEO_TAGS_LIMIT = 50;

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
