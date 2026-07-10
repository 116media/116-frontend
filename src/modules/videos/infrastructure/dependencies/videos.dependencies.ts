import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { AddVideoToPlaylistUseCase } from "@/modules/videos/application/usecases/addvideotoplaylist.usecase";
import { CreatePlaylistUseCase } from "@/modules/videos/application/usecases/createplaylist.usecase";
import { GetMyPlaylistsUseCase } from "@/modules/videos/application/usecases/getmyplaylists.usecase";
import { GetPopularVideosUseCase } from "@/modules/videos/application/usecases/getpopularvideos.usecase";
import { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import { GetPublishedVideosUseCase } from "@/modules/videos/application/usecases/getpublishedvideos.usecase";
import { GetShowsUseCase } from "@/modules/videos/application/usecases/getshows.usecase";
import { GetVideoBySlugUseCase } from "@/modules/videos/application/usecases/getvideobyslug.usecase";
import { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import { GetVideoExclusiveShowUseCase } from "@/modules/videos/application/usecases/getvideoexclusiveshow.usecase";
import { GetVideoLyricsUseCase } from "@/modules/videos/application/usecases/getvideolyrics.usecase";
import { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import { GetYoutubeVideoStatsUseCase } from "@/modules/videos/application/usecases/getyoutubevideostats.usecase";
import { RateVideoUseCase } from "@/modules/videos/application/usecases/ratevideo.usecase";
import { ShareVideoUseCase } from "@/modules/videos/application/usecases/sharevideo.usecase";
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
        getShowsUseCase: asClass(GetShowsUseCase).transient(),
        getVideoPopularTagsUseCase: asClass(GetVideoPopularTagsUseCase).transient(),
        getVideoExclusiveShowUseCase: asClass(GetVideoExclusiveShowUseCase).transient(),
        getVideoBySlugUseCase: asClass(GetVideoBySlugUseCase).transient(),
        getPublishedVideosUseCase: asClass(GetPublishedVideosUseCase).transient(),
        getPopularVideosUseCase: asClass(GetPopularVideosUseCase).transient(),
        getVideoLyricsUseCase: asClass(GetVideoLyricsUseCase).transient(),
        getMyPlaylistsUseCase: asClass(GetMyPlaylistsUseCase).transient(),
        getYoutubeVideoStatsUseCase: asClass(GetYoutubeVideoStatsUseCase).transient(),

        // Interactions
        rateVideoUseCase: asClass(RateVideoUseCase).transient(),
        shareVideoUseCase: asClass(ShareVideoUseCase).transient(),
        createPlaylistUseCase: asClass(CreatePlaylistUseCase).transient(),
        addVideoToPlaylistUseCase: asClass(AddVideoToPlaylistUseCase).transient()
    });
}
