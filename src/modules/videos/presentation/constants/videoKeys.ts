/**
 * Stable TanStack Query keys for the videos feature. The detail page adds
 * `detail(slug)`, `lyrics(videoId)`, `similar(videoId)`, and
 * `popular(videoId)` — the latter two keyed by the open video so each video's
 * exclusion set caches independently. `youtubeStats(youtubeId)` caches the
 * YouTube Data API chips per YouTube id, and `myPlaylists` is the signed-in
 * user's playlist list for the add-to-playlist modal.
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
 * The number of videos the similar tab shows.
 */
export const SIMILAR_VIDEOS_LIMIT = 3;

/**
 * The maximum number of popular videos the sidebar shows.
 */
export const POPULAR_VIDEOS_LIMIT = 5;
