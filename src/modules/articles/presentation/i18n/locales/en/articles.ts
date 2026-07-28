/**
 * articles (en)
 *
 * @description
 * English strings for the article card, feed grid, and filter toolbar surfaces. Spread by
 * the locale barrel so keys resolve as `t("articles.card.<key>")` and siblings; `readTime`
 * uses i18next plural suffixes. Must hold the exact same keys as the French mirror.
 */
export const articles = {
    pageTitle: "Articles",
    card: {
        read: "Read Article",
        readTime_one: "{{count}} min read",
        readTime_other: "{{count}} min read",
        share: "Share",
        bookmark: "Bookmark",
        like: "Like",
        comments: "Comments"
    },
    grid: {
        empty: {
            title: "No articles yet",
            body: "Check back soon for new stories."
        },
        noResults: {
            title: "No articles match your filters",
            body: "Try a different search, category, or tag."
        },
        error: {
            title: "Couldn't load articles",
            retry: "Try again"
        },
        end: "You're all caught up"
    },
    filters: {
        searchPlaceholder: "Search articles…",
        clearSearch: "Clear search",
        allCategories: "All categories",
        category: "Category",
        allTags: "All tags",
        tagSearch: "Find a tag…",
        clear: "Clear filters"
    }
} as const;
