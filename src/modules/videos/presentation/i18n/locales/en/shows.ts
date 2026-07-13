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
    backToShows: "Back to shows",
    empty: {
        title: "No shows yet",
        body: "Check back soon for new shows."
    },
    error: {
        title: "Couldn't load shows",
        retry: "Try again"
    },
    notFound: {
        title: "Show not found",
        subtitle: "This show may have been removed or is no longer available."
    }
} as const;
