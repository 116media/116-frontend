import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { ArticlesMapper } from "@/modules/articles/infrastructure/mappers/articles.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import { type Api, EnumCoreContentType } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

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
            return ok(response.data.articles.map(ArticlesMapper.articleSummaryFromDto));
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

            return ok(categoriesResponse.data.categories.map(ArticlesMapper.categoryFromDto));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getArticlePopularTags(): Promise<Result<IArticleTagEntity[]>> {
        try {
            const response = await this.api.publicGetPopularTags({
                contentType: EnumCoreContentType.Article
            });
            return ok(response.data.tags.map(ArticlesMapper.tagFromDto));
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
}
