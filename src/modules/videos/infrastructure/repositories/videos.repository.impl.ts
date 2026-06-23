import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { VideosMapper } from "@/modules/videos/infrastructure/mappers/videos.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import { type Api, EnumCoreContentType } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Videos repository implementation using the public REST API.
 *
 * @description
 * Implements IVideosRepositoryPort by delegating to an injected Api instance.
 * Works for both browser (Awilix injects the browser apiClient registered as `api`)
 * and server (layout manually instantiates with createServerApiClient()).
 * All methods return `Result<T>` — errors are caught and converted to
 * typed Failure values via ProblemMapper.
 */
export class VideosRepositoryImpl implements IVideosRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getPromotedVideos(): Promise<Result<IVideoSummaryEntity[]>> {
        try {
            const response = await this.api.getPromotedVideos();
            return ok(response.data.videos.map(VideosMapper.videoSummaryFromDto));
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

            return ok(categoriesResponse.data.categories.map(VideosMapper.categoryFromDto));
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

            return ok(categoriesResponse.data.categories.map(VideosMapper.showFromDto));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getVideoPopularTags(): Promise<Result<IVideoTagEntity[]>> {
        try {
            const response = await this.api.publicGetPopularTags({
                contentType: EnumCoreContentType.Video
            });
            return ok(response.data.tags.map(VideosMapper.tagFromDto));
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
}
