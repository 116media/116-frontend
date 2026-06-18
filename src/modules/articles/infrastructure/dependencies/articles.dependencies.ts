import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import { GetArticlePromotionFeedUseCase } from "@/modules/articles/application/usecases/getarticlepromotionfeed.usecase";
import { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import { ArticlesRepositoryImpl } from "@/modules/articles/infrastructure/repositories/articles.repository.impl";

/**
 * Registers articles module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and all use cases as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container
 */
export function registerArticlesDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        articlesRepository: asClass(ArticlesRepositoryImpl).singleton(),

        // Queries
        getPromotedArticlesUseCase: asClass(GetPromotedArticlesUseCase).transient(),
        getArticleCategoriesUseCase: asClass(GetArticleCategoriesUseCase).transient(),
        getArticlePopularTagsUseCase: asClass(GetArticlePopularTagsUseCase).transient(),
        getArticlePromotionFeedUseCase: asClass(GetArticlePromotionFeedUseCase).transient()
    });
}
