/**
 * shows (en)
 *
 * @description
 * English strings for the shows page — the title and grid states — referenced
 * as `t("videos.shows.<key>")`. Must hold the exact same keys as the French
 * mirror.
 */
export const shows = {
    title: "All Shows",
    empty: {
        title: "No shows yet",
        body: "Check back soon for new shows."
    },
    error: {
        title: "Couldn't load shows",
        retry: "Try again"
    }
} as const;
