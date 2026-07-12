import type {
    IAddVideoToPlaylistInput,
    IPopularVideosQuery,
    IPublishedVideosQuery,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import { VideosMapper } from "@/modules/videos/infrastructure/mappers/videos.mapper";
import { unknownFailure } from "@/shared/domain/failures/failure";
import { err, ok, type Result } from "@/shared/domain/results/result";
import { type Api, EnumCoreContentType } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Videos repository implementation using the public REST API.
 *
 * @description
 * Implements IVideosRepositoryPort by delegating to an injected Api instance,
 * usable from both the browser and server clients. All methods return
 * `Result<T>` — errors are converted to typed Failure values via ProblemMapper.
 */
export class VideosRepositoryImpl implements IVideosRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getPromotedVideos(): Promise<Result<IVideoSummaryEntity[]>> {
        try {
            const response = await this.api.getPromotedVideos();
            return ok(VideosMapper.videoSummaryListFromDto(response.data.videos));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getVideoCategories(): Promise<Result<IVideoCategoryEntity[]>> {
        try {
            const contentTypesResponse = await this.api.publicGetAllContentTypes();
            const videoContentType = contentTypesResponse.data.contentTypes.find(
                (ct) => ct.name === EnumCoreContentType.Video
            );

            if (!videoContentType) return ok([]);

            const categoriesResponse = await this.api.publicGetActiveCategories({
                contentTypeId: videoContentType.id
            });

            return ok(VideosMapper.categoryListFromDto(categoriesResponse.data.categories));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getShows(): Promise<Result<IShowEntity[]>> {
        try {
            const contentTypesResponse = await this.api.publicGetAllContentTypes();
            const videoContentType = contentTypesResponse.data.contentTypes.find(
                (ct) => ct.name === EnumCoreContentType.Video
            );

            if (!videoContentType) return ok([]);

            const categoriesResponse = await this.api.publicGetActiveCategories({
                contentTypeId: videoContentType.id
            });

            return ok(VideosMapper.showListFromDto(categoriesResponse.data.categories));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getVideoPopularTags(): Promise<Result<IVideoTagEntity[]>> {
        try {
            const response = await this.api.publicGetPopularTags({
                contentType: EnumCoreContentType.Video
            });
            return ok(VideosMapper.tagListFromDto(response.data.tags));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getExclusiveShow(): Promise<Result<IVideoExclusiveShowEntity>> {
        try {
            const response = await this.api.publicGetExclusiveCategory();
            return ok(VideosMapper.exclusiveShowFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getVideoBySlug(slug: string): Promise<Result<IVideoDetailEntity>> {
        try {
            const response = await this.api.getVideoBySlug(slug);
            return ok(VideosMapper.videoDetailFromDto(response.data.video));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getPublishedVideos(query: IPublishedVideosQuery): Promise<Result<IVideoSummaryEntity[]>> {
        try {
            const response = await this.api.getPublishedVideos(query);
            return ok(VideosMapper.videoSummaryListFromDto(response.data.videos.items));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getPopularVideos(query: IPopularVideosQuery): Promise<Result<IVideoSummaryEntity[]>> {
        try {
            const response = await this.api.getPopularVideos({
                limit: query.limit,
                excludeId: query.excludeId,
                categoryId: query.categoryId
            });
            return ok(VideosMapper.videoSummaryListFromDto(response.data.videos));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getVideoLyrics(videoId: string): Promise<Result<IVideoLyricsEntity>> {
        try {
            const response = await this.api.getLyricsByVideoId(videoId);
            return ok(VideosMapper.videoLyricsFromDto(response.data.lyrics));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async rateVideo(id: string, stars: number): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicRateVideo(id, { stars });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async shareVideo(id: string, _platform: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicShareVideo(id);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getMyPlaylists(): Promise<Result<IPlaylistEntity[]>> {
        try {
            const response = await this.api.publicGetMyPlaylists();
            return ok(VideosMapper.playlistListFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async createPlaylist(name: string): Promise<Result<IPlaylistEntity>> {
        try {
            const response = await this.api.publicCreatePlaylist({ name });
            return ok(VideosMapper.playlistFromDto(response.data.playlist));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async addVideoToPlaylist(input: IAddVideoToPlaylistInput): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicAddVideoToPlaylist(input.playlistId, {
                videoId: input.videoId,
                sortOrder: input.sortOrder
            });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getYoutubeStats(youtubeId: string): Promise<Result<IYoutubeVideoStats>> {
        if (typeof window === "undefined") return err(unknownFailure());

        try {
            const response = await fetch(`/api/youtube/${youtubeId}`);
            if (!response.ok) return err(unknownFailure());
            return ok(VideosMapper.youtubeStatsFromJson(await response.json()));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
