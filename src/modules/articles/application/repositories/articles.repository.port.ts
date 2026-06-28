import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
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
     * Fetches article tags — tags used by at least one article — optionally filtered
     * by a search term (case-insensitive partial match on name and slug, server-side)
     * and capped to a bounded count. Video-only tags are excluded so the result only
     * holds tags that can match an article in the feed.
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
}
