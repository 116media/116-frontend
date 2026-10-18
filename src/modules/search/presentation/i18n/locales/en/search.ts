/**
 * search (en)
 *
 * @description
 * English strings for site search: the overlay, the search route and its states. Mirror
 * of the French catalog; must hold the exact same keys.
 */
export const search = {
    meta: {
        title: "Search"
    },
    field: {
        label: "Search 116",
        placeholder: "Search an article, a video, a short…",
        clear: "Clear search",
        submit: "Run the search",
        submitShort: "Search",
        escape: "Esc",
        close: "Close search"
    },
    scope: {
        label: "Filter by content type",
        all: "All",
        articles: "Articles",
        videos: "Videos",
        shorts: "Shorts"
    },
    type: {
        article: "Article",
        video: "Video",
        short: "Short",
        lyrics: "Lyrics"
    },
    idle: {
        recent: "Recent searches",
        clear: "Clear",
        explore: "Explore by tag"
    },
    overlay: {
        scroll: "Scroll for more",
        seeAll_one: "See the result",
        seeAll_other: "See all {{count}} results"
    },
    results: {
        count_one: "{{count}} result",
        count_other: "{{count}} results"
    },
    empty: {
        title: "No results for “{{query}}”",
        hint: "Check the spelling, or try something broader: an artist, a show, a genre."
    },
    prompt: "Type at least two characters to start searching.",
    error: "The search did not go through. Try again in a moment."
} as const;
