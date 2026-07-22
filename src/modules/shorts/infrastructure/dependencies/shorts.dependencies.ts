import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { BookmarkShortUseCase } from "@/modules/shorts/application/usecases/bookmarkshort.usecase";
import { GetOwnLikedShortsUseCase } from "@/modules/shorts/application/usecases/getownlikedshorts.usecase";
import { GetOwnSavedShortsUseCase } from "@/modules/shorts/application/usecases/getownsavedshorts.usecase";
import { GetOwnSharedShortsUseCase } from "@/modules/shorts/application/usecases/getownsharedshorts.usecase";
import { GetShortBySlugUseCase } from "@/modules/shorts/application/usecases/getshortbyslug.usecase";
import { GetShortsFeedUseCase } from "@/modules/shorts/application/usecases/getshortsfeed.usecase";
import { LikeShortUseCase } from "@/modules/shorts/application/usecases/likeshort.usecase";
import { RecordShortViewUseCase } from "@/modules/shorts/application/usecases/recordshortview.usecase";
import { ShareShortUseCase } from "@/modules/shorts/application/usecases/shareshort.usecase";
import { UnbookmarkShortUseCase } from "@/modules/shorts/application/usecases/unbookmarkshort.usecase";
import { UnlikeShortUseCase } from "@/modules/shorts/application/usecases/unlikeshort.usecase";
import { ShortsRepositoryImpl } from "@/modules/shorts/infrastructure/repositories/shorts.repository.impl";

/**
 * Registers shorts module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and all use cases as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerShortsDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        shortsRepository: asClass(ShortsRepositoryImpl).singleton(),

        // Queries
        getShortsFeedUseCase: asClass(GetShortsFeedUseCase).transient(),
        getShortBySlugUseCase: asClass(GetShortBySlugUseCase).transient(),

        // Favorites
        getOwnLikedShortsUseCase: asClass(GetOwnLikedShortsUseCase).transient(),
        getOwnSavedShortsUseCase: asClass(GetOwnSavedShortsUseCase).transient(),
        getOwnSharedShortsUseCase: asClass(GetOwnSharedShortsUseCase).transient(),

        // Interactions
        likeShortUseCase: asClass(LikeShortUseCase).transient(),
        unlikeShortUseCase: asClass(UnlikeShortUseCase).transient(),
        bookmarkShortUseCase: asClass(BookmarkShortUseCase).transient(),
        unbookmarkShortUseCase: asClass(UnbookmarkShortUseCase).transient(),
        shareShortUseCase: asClass(ShareShortUseCase).transient(),
        recordShortViewUseCase: asClass(RecordShortViewUseCase).transient()
    });
}
