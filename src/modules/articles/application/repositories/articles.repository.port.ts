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
 * Query for a page of a comment's replies. Mirrors
 * GET /api/v1/public/articles/comments/{commentId}/replies.
 *
 * @interface ICommentRepliesQuery
 *
 * @property {string} commentId - The top-level comment whose replies to page through (UUID)
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 */
export interface ICommentRepliesQuery {
    commentId: string;
    pageIndex: number;
    pageSize: number;
}

/**
 * Input for replying to a top-level comment. Mirrors
 * POST /api/v1/public/articles/{id}/comments/{commentId}/replies.
 *
 * @interface IAddCommentReplyInput
 *
 * @property {string} articleId - The article the parent comment belongs to (UUID)
 * @property {string} commentId - The top-level comment being replied to (UUID)
 * @property {string} body - The reply text
 */
export interface IAddCommentReplyInput {
    articleId: string;
    commentId: string;
    body: string;
}

/**
 * Input for editing the caller's own comment. Mirrors
 * PUT /api/v1/public/articles/{id}/comments/{commentId}.
 *
 * @interface IEditArticleCommentInput
 *
 * @property {string} articleId - The article the comment belongs to (UUID)
 * @property {string} commentId - The comment to edit (UUID)
 * @property {string} body - The replacement comment text
 */
export interface IEditArticleCommentInput {
    articleId: string;
    commentId: string;
    body: string;
}

/**
 * Input for deleting the caller's own comment. Mirrors
 * DELETE /api/v1/public/articles/{id}/comments/{commentId}.
 *
 * @interface IDeleteArticleCommentInput
 *
 * @property {string} articleId - The article the comment belongs to (UUID)
 * @property {string} commentId - The comment to delete (UUID)
 */
export interface IDeleteArticleCommentInput {
    articleId: string;
    commentId: string;
}

/**
 * Query for a page of the authenticated user's bookmarked articles. Mirrors
 * GET /api/v1/public/articles/bookmarks.
 *
 * @interface IMyArticleBookmarksQuery
 *
 * @property {number} pageIndex - Zero-based page number
 * @property {number} pageSize - Items per page
 */
export interface IMyArticleBookmarksQuery {
    pageIndex: number;
    pageSize: number;
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
     * Records a share event for an article. Anonymous access is permitted; the
     * `shareChannel` is stored server-side for per-channel share analytics.
     *
     * @param id - The article identifier (UUID)
     * @param shareChannel - The share channel (e.g. "WebShare", "Clipboard", "Facebook")
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    shareArticle(id: string, shareChannel: string): Promise<Result<boolean>>;

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
     * Adds a comment to an article. Requires authentication.
     *
     * @param input - Article id plus the comment body
     * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    addArticleComment(input: IAddArticleCommentInput): Promise<Result<IArticleCommentEntity>>;

    /**
     * Fetches one page of a top-level comment's replies.
     *
     * @param query - Comment id plus paging
     * @returns `ok(IArticleCommentPage)` on success, `err(Failure)` on failure
     */
    getCommentReplies(query: ICommentRepliesQuery): Promise<Result<IArticleCommentPage>>;

    /**
     * Posts a single-level reply to a top-level comment. Requires authentication.
     *
     * @param input - Article id, parent comment id, and the reply body
     * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure
     */
    addCommentReply(input: IAddCommentReplyInput): Promise<Result<IArticleCommentEntity>>;

    /**
     * Edits the authenticated user's own comment; the backend enforces ownership.
     *
     * @param input - Article id, comment id, and the replacement body
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    editArticleComment(input: IEditArticleCommentInput): Promise<Result<boolean>>;

    /**
     * Soft-deletes the authenticated user's own comment; the backend enforces ownership.
     *
     * @param input - Article id plus the comment id
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    deleteArticleComment(input: IDeleteArticleCommentInput): Promise<Result<boolean>>;

    /**
     * Records that the authenticated user likes a comment.
     *
     * @param commentId - The comment identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    likeArticleComment(commentId: string): Promise<Result<boolean>>;

    /**
     * Removes the authenticated user's like from a comment.
     *
     * @param commentId - The comment identifier (UUID)
     * @returns `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    unlikeArticleComment(commentId: string): Promise<Result<boolean>>;

    /**
     * Fetches one page of the authenticated user's bookmarked articles, newest first.
     *
     * @param query - Paging
     * @returns `ok(IArticlePage)` on success, `err(Failure)` on failure
     */
    getMyArticleBookmarks(query: IMyArticleBookmarksQuery): Promise<Result<IArticlePage>>;

    /**
     * Fetches the most popular published articles, ranked server-side by weighted
     * engagement, optionally excluding one article and scoping to a category.
     *
     * @param query - Limit plus optional exclusion and category scope
     * @returns `ok(IArticleSummaryEntity[])` on success, `err(Failure)` on failure
     */
    getPopularArticles(query: IPopularArticlesQuery): Promise<Result<IArticleSummaryEntity[]>>;
}
