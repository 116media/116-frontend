import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import type { Result } from "@/shared/domain/results/result";

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
}
