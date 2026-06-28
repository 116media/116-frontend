/**
 * IArticleFeedFilters
 *
 * @description
 * Filters that scope the article feed. All fields are optional; when none is set the
 * query targets the full feed.
 *
 * @interface IArticleFeedFilters
 *
 * @property {string} [search] - Optional full-text search term
 * @property {string} [categoryId] - Optional category filter (UUID)
 * @property {string} [tagSlug] - Optional tag filter
 */
export interface IArticleFeedFilters {
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}

/**
 * Stable TanStack Query keys for the articles feature. The feed key embeds the active
 * filters so each filter combination caches independently; categories and tags have
 * their own stable entries for the toolbar reads.
 */
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: ["articles", "categories"] as const,
    popularTags: ["articles", "tags", "popular"] as const,
    allTags: (search: string) => [...articleKeys.all, "tags", "all", search] as const
};

export const ARTICLES_PAGE_SIZE = 12;
