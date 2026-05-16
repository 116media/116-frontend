import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import { VideosRepositoryImpl } from "@/modules/videos/infrastructure/repositories/videos.repository.impl";

/**
 * Registers videos module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and all use cases as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container
 */
export function registerVideosDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        videosRepository: asClass(VideosRepositoryImpl).singleton(),

        // Queries
        getPromotedVideosUseCase: asClass(GetPromotedVideosUseCase).transient(),
        getVideoCategoriesUseCase: asClass(GetVideoCategoriesUseCase).transient(),
        getVideoPopularTagsUseCase: asClass(GetVideoPopularTagsUseCase).transient()
    });
}
