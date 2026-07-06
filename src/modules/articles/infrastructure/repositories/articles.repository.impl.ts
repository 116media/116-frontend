import type {
    IAddArticleCommentInput,
    IArticleCommentsQuery,
    IArticlesRepositoryPort,
    IPopularArticlesQuery,
    IPublishedArticlesQuery
} from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { ArticlesMapper } from "@/modules/articles/infrastructure/mappers/articles.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import { type Api, EnumCoreContentType } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Maximum number of article tags requested for the "All tags" popover. Caps the server
 * response so the popover never pulls the full tag vocabulary; matching tags beyond this
 * count are reachable through the popover's search box.
 */
const ALL_TAGS_LIMIT = 50;

/**
 * Maximum number of popular article tags requested for the quick-pick tag strip and the
 * navigation prefetch that warms it. Keeps the strip to the most-used tags; everything else
 * is reachable through the searchable "All tags" popover.
 */
const POPULAR_TAGS_LIMIT = 15;

/**
 * Articles repository implementation using the public REST API.
 *
 * @description
 * Implements IArticlesRepositoryPort by delegating to an injected Api instance.
 * Works for both browser (Awilix injects the browser apiClient registered as `api`)
 * and server (layout manually instantiates with createServerApiClient()).
 * All methods return `Result<T>` — errors are caught and converted to
 * typed Failure values via ProblemMapper.
 */
export class ArticlesRepositoryImpl implements IArticlesRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getPromotedArticles(): Promise<Result<IArticleSummaryEntity[]>> {
        try {
            const response = await this.api.getPromotedArticles();
            return ok(ArticlesMapper.articleSummaryListFromDto(response.data.articles));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArticleCategories(): Promise<Result<IArticleCategoryEntity[]>> {
        try {
            const contentTypesResponse = await this.api.publicGetAllContentTypes();
            const articleContentType = contentTypesResponse.data.contentTypes.find(
                (ct) => ct.name === EnumCoreContentType.Article
            );

            if (!articleContentType) return ok([]);

            const categoriesResponse = await this.api.publicGetActiveCategories({
                contentTypeId: articleContentType.id
            });

            return ok(ArticlesMapper.categoryListFromDto(categoriesResponse.data.categories));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArticlePopularTags(): Promise<Result<IArticleTagEntity[]>> {
        try {
            const response = await this.api.publicGetPopularTags({
                contentType: EnumCoreContentType.Article,
                limit: POPULAR_TAGS_LIMIT
            });
            return ok(ArticlesMapper.tagListFromDto(response.data.tags));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getPromotionFeed(): Promise<Result<IArticlePromotionFeedEntity>> {
        try {
            const response = await this.api.getArticlePromotionFeed();
            return ok(ArticlesMapper.promotionFeedFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getPublishedArticles(query: IPublishedArticlesQuery): Promise<Result<IArticlePage>> {
        try {
            const response = await this.api.getPublishedArticles({
                pageIndex: query.pageIndex,
                pageSize: query.pageSize,
                search: query.search,
                categoryId: query.categoryId,
                tagSlug: query.tagSlug
            });
            return ok(ArticlesMapper.articlePageFromDto(response.data.articles));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getAllTags(search?: string): Promise<Result<IArticleTagEntity[]>> {
        try {
            const response = await this.api.publicGetAllTags({
                search,
                contentType: EnumCoreContentType.Article,
                limit: ALL_TAGS_LIMIT
            });
            return ok(ArticlesMapper.tagListFromDto(response.data.tags));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async likeArticle(id: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicLikeArticle(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async unlikeArticle(id: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicUnlikeArticle(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async bookmarkArticle(id: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicBookmarkArticle(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async unbookmarkArticle(id: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicUnbookmarkArticle(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async shareArticle(id: string, _platform: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicShareArticle(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArticleBySlug(slug: string): Promise<Result<IArticleDetailEntity>> {
        try {
            const response = await this.api.getArticleBySlug(slug);
            return ok(ArticlesMapper.articleDetailFromDto(response.data.article));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArticleComments(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>> {
        try {
            const response = await this.api.publicGetArticleComments(query.articleId, {
                pageIndex: query.pageIndex,
                pageSize: query.pageSize
            });
            return ok(ArticlesMapper.articleCommentPageFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async addArticleComment(
        input: IAddArticleCommentInput
    ): Promise<Result<IArticleCommentEntity>> {
        try {
            const response = await this.api.publicAddArticleComment(input.articleId, {
                body: input.body
            });
            return ok(ArticlesMapper.articleCommentFromDto(response.data.comment));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getPopularArticles(
        query: IPopularArticlesQuery
    ): Promise<Result<IArticleSummaryEntity[]>> {
        try {
            const response = await this.api.publicGetPopularArticles({
                limit: query.limit,
                excludeId: query.excludeId,
                categoryId: query.categoryId
            });
            return ok(ArticlesMapper.articleSummaryListFromDto(response.data.articles));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
