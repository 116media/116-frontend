import { asClass, asValue, createContainer, InjectionMode } from "awilix";
import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import type { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import type { GetArticlePromotionFeedUseCase } from "@/modules/articles/application/usecases/getarticlepromotionfeed.usecase";
import type { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import { registerArticlesDependencies } from "@/modules/articles/infrastructure/dependencies/articles.dependencies";
import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import type { GetShowsUseCase } from "@/modules/videos/application/usecases/getshows.usecase";
import type { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import type { GetVideoExclusiveShowUseCase } from "@/modules/videos/application/usecases/getvideoexclusiveshow.usecase";
import type { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import { registerVideosDependencies } from "@/modules/videos/infrastructure/dependencies/videos.dependencies";
import { PrefetchNavigationUseCase } from "@/shared/application/usecases/prefetchnavigation.usecase";
import { apiClient } from "@/shared/infrastructure/api/client";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";

/**
 * Cradle type defining all dependencies available in the DI container.
 *
 * @interface Cradle
 *
 * @description
 * Maps registration names to their resolved types for full type-safe
 * access via `container.cradle`. Each property corresponds to a
 * registration in a per-module dependency file.
 */
export interface Cradle {
    // Shared API client — browser singleton injected into all repositories
    client: Api<unknown>;

    // Articles repository
    articlesRepository: IArticlesRepositoryPort;

    // Articles use cases
    getPromotedArticlesUseCase: GetPromotedArticlesUseCase;
    getArticleCategoriesUseCase: GetArticleCategoriesUseCase;
    getArticlePopularTagsUseCase: GetArticlePopularTagsUseCase;
    getArticlePromotionFeedUseCase: GetArticlePromotionFeedUseCase;

    // Videos repository
    videosRepository: IVideosRepositoryPort;

    // Videos use cases
    getPromotedVideosUseCase: GetPromotedVideosUseCase;
    getVideoCategoriesUseCase: GetVideoCategoriesUseCase;
    getShowsUseCase: GetShowsUseCase;
    getVideoPopularTagsUseCase: GetVideoPopularTagsUseCase;
    getVideoExclusiveShowUseCase: GetVideoExclusiveShowUseCase;

    // Shared composite use cases
    prefetchNavigationUseCase: PrefetchNavigationUseCase;
}

/**
 * Awilix DI container — the composition root for the frontend.
 *
 * @description
 * Creates a single container with PROXY injection mode and strict lifetime
 * checks. Each feature module registers its own dependencies via a
 * dedicated registration function.
 */
const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
    strict: true
});

container.register({ client: asValue(apiClient) });

registerArticlesDependencies(container);
registerVideosDependencies(container);

// Shared composite use cases (depend on both modules)
container.register({
    prefetchNavigationUseCase: asClass(PrefetchNavigationUseCase).transient()
});

export default container;
