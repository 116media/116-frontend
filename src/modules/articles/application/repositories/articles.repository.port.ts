import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import type { Result } from "@/shared/domain/results/result";

/**
 * Query for a page of published articles. Mirrors GET /api/v1/public/articles.
 *
 * @interface IPublishedArticlesQuery
 *
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 * @property {string} [search] - Optional full-text search term
 * @property {string} [categoryId] - Optional category filter (UUID)
 * @property {string} [tagSlug] - Optional tag filter
 */
export interface IPublishedArticlesQuery {
    pageIndex: number;
    pageSize: number;
    search?: string;
    categoryId?: string;
    tagSlug?: string;
}

/**
 * Query for a page of an article's comments. Mirrors
 * GET /api/v1/public/articles/{id}/comments.
 *
 * @interface IArticleCommentsQuery
 *
 * @property {string} articleId - The article whose comments to page through (UUID)
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 */
export interface IArticleCommentsQuery {
    articleId: string;
    pageIndex: number;
    pageSize: number;
}

/**
 * Input for adding a comment to an article. Mirrors
 * POST /api/v1/public/articles/{id}/comments.
 *
 * @interface IAddArticleCommentInput
 *
 * @property {string} articleId - The article to comment on (UUID)
 * @property {string} body - The comment text
 */
export interface IAddArticleCommentInput {
    articleId: string;
    body: string;
}

/**
 * Query for the popularity-ranked article list. Mirrors
 * GET /api/v1/public/articles/popular.
 *
 * @interface IPopularArticlesQuery
 *
 * @property {number} limit - Maximum number of articles to return
 * @property {string} [excludeId] - Article id to omit, e.g. the article currently open (UUID)
 * @property {string} [categoryId] - Optional category scope (UUID)
 */
export interface IPopularArticlesQuery {
    limit: number;
    excludeId?: string;
    categoryId?: string;
}

/**
 * Repository port for articles data access operations.
 *
 * @description
 * Defines the contract for all article-related data access.
 * All methods return `Result<T>` — errors are represented as typed
 * `Failure` values, never thrown.
 */
export interface IArticlesRepositoryPort {
    /**
     * Fetches the list of currently promoted articles.
     *
     * @returns `ok(IArticleSummaryEntity[])` on success, `err(Failure)` on failure
     */
    getPromotedArticles(): Promise<Result<IArticleSummaryEntity[]>>;

    /**
     * Fetches the list of active categories scoped to articles.
     *
     * @returns `ok(IArticleCategoryEntity[])` on success, `err(Failure)` on failure
     */
    getArticleCategories(): Promise<Result<IArticleCategoryEntity[]>>;

    /**
     * Fetches the most popular tags scoped to the Article content type.
     *
     * @returns `ok(IArticleTagEntity[])` on success, `err(Failure)` on failure
     */
    getArticlePopularTags(): Promise<Result<IArticleTagEntity[]>>;

    /**
     * Fetches the homepage article promotion feed with spots and gossip strip.
     *
     * @returns `ok(IArticlePromotionFeedEntity)` on success, `err(Failure)` on failure
     */
    getPromotionFeed(): Promise<Result<IArticlePromotionFeedEntity>>;

    /**
     * Fetches one page of published articles for the public feed.
     *
     * @param query - Paging plus optional search/category/tag filters
     * @returns `ok(IArticlePage)` on success, `err(Failure)` on failure
     */
    getPublishedArticles(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>>;

    /**
     * Fetches the tags used by at least one article, optionally filtered by a server-side
     * search term (partial match on name and slug) and capped to a bounded count.
     * Video-only tags are excluded so the result only holds tags that can match an article.
     *
     * @param search - Optional tag-name search term
     * @returns `ok(IArticleTagEntity[])` on success, `err(Failure)` on failure
     */
    getAllTags(search?: string): Promise<Result<IArticleTagEntity[]>>;

    /**
     * Records that the authenticated user likes an article.
     *
     * @param id - The article identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    likeArticle(id: string): Promise<Result<boolean>>;

    /**
     * Removes the authenticated user's like from an article.
     *
     * @param id - The article identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    unlikeArticle(id: string): Promise<Result<boolean>>;

    /**
     * Records that the authenticated user bookmarked an article.
     *
     * @param id - The article identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    bookmarkArticle(id: string): Promise<Result<boolean>>;

    /**
     * Removes the authenticated user's bookmark from an article.
     *
     * @param id - The article identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    unbookmarkArticle(id: string): Promise<Result<boolean>>;

    /**
     * Records a share event for an article. Anonymous access is permitted.
     * The share endpoint accepts no payload, so `platform` is client-side
     * context only and is not transmitted.
     *
     * @param id - The article identifier (UUID)
     * @param platform - The share surface used (e.g. "web-share", "clipboard")
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    shareArticle(id: string, platform: string): Promise<Result<boolean>>;

    /**
     * Fetches one article by its slug.
     *
     * @param slug - The article slug
     * @returns `ok(IArticleDetailEntity)` on success, `err(Failure)` on failure
     */
    getArticleBySlug(slug: string): Promise<Result<IArticleDetailEntity>>;

    /**
     * Fetches one page of an article's comments.
     *
     * @param query - Article id plus paging
     * @returns `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
     */
    getArticleComments(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>>;

    /**
     * Adds a comment to an article. Requires authentication. Editing and deleting a
     * comment are deferred — the endpoints exist but the first cut ships create + list
     * only.
     *
     * @param input - Article id plus the comment body
     * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    addArticleComment(input: IAddArticleCommentInput): Promise<Result<IArticleCommentEntity>>;

    /**
     * Fetches the most popular published articles, ranked server-side by weighted
     * engagement, optionally excluding one article and scoping to a category.
     *
     * @param query - Limit plus optional exclusion and category scope
     * @returns `ok(IArticleSummaryEntity[])` on success, `err(Failure)` on failure
     */
    getPopularArticles(query: IPopularArticlesQuery): Promise<Result<IArticleSummaryEntity[]>>;
}
