/**
 * browse (en)
 *
 * @description
 * English strings for the videos browse surface — the title, filter toolbar,
 * categories modal, and feed grid — referenced as `t("videos.browse.<key>")`.
 * Must hold the exact same keys as the French mirror.
 */
export const browse = {
    title: "Explore Video Collections",
    filters: {
        all: "All",
        searchPlaceholder: "Search videos…",
        clearSearch: "Clear search",
        browseAllShows: "All the shows",
        allTags: "All tags",
        tagSearch: "Find a tag…",
        clear: "Clear filters"
    },
    modal: {
        title: "Shows & categories",
        searchPlaceholder: "Search a show or category…",
        empty: "No show matches your search"
    },
    grid: {
        empty: {
            title: "No videos yet",
            body: "Check back soon for new videos."
        },
        noResults: {
            title: "No videos match your filters",
            body: "Try a different search, category, or tag."
        },
        error: {
            title: "Couldn't load videos",
            retry: "Try again"
        },
        end: "You're all caught up"
    }
} as const;
