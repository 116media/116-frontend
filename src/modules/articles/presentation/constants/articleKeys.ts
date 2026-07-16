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
 * filters so each filter combination caches independently; the detail page adds
 * `detail(slug)`, `comments(articleId)`, and `popular(articleId)` keyed by the open article.
 */
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: ["articles", "categories"] as const,
    popularTags: ["articles", "tags", "popular"] as const,
    allTags: (search: string) => [...articleKeys.all, "tags", "all", search] as const,
    detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
    comments: (articleId: string) => [...articleKeys.all, "detail", articleId, "comments"] as const,
    replies: (commentId: string) => [...articleKeys.all, "comments", commentId, "replies"] as const,
    bookmarks: ["articles", "bookmarks"] as const,
    popular: (articleId: string) => [...articleKeys.all, "popular", articleId] as const,
    favorites: {
        bookmarked: ["articles", "favorites", "bookmarked"] as const,
        commented: ["articles", "favorites", "commented"] as const,
        liked: ["articles", "favorites", "liked"] as const,
        shared: ["articles", "favorites", "shared"] as const,
        myComments: (articleId: string) =>
            [...articleKeys.all, "favorites", "myComments", articleId] as const
    }
};

export const ARTICLES_PAGE_SIZE = 12;

/**
 * Page size for the article comment list.
 */
export const ARTICLE_COMMENTS_PAGE_SIZE = 10;

/**
 * Page size for a comment's reply thread; small because replies expand inline.
 */
export const COMMENT_REPLIES_PAGE_SIZE = 5;

/**
 * Maximum comment/reply body length the composers accept before blocking submit.
 */
export const MAX_COMMENT_LENGTH = 1000;

/**
 * Page size for the "my bookmarks" article grid.
 */
export const BOOKMARKS_PAGE_SIZE = 12;

/**
 * Page size for the favorites collection lists (bookmarked, commented, liked, shared).
 */
export const FAVORITES_PAGE_SIZE = 12;

/**
 * Page size for the per-article "my comments" drawer list.
 */
export const FAVORITES_MY_COMMENTS_PAGE_SIZE = 20;

/**
 * Maximum number of article tags requested for the "All tags" popover; tags beyond this
 * count are reachable through the popover's search box.
 */
export const ALL_TAGS_LIMIT = 50;

/**
 * Maximum number of popular article tags requested for the quick-pick tag strip and the
 * navigation prefetch that warms it.
 */
export const POPULAR_TAGS_LIMIT = 15;
