import type {
    IShareShortInput,
    IShortsFeedQuery,
    IShortsRepositoryPort
} from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import type { IShortVideoFeedPage } from "@/modules/shorts/domain/entities/IShortVideoFeedPage";
import { ShortsMapper } from "@/modules/shorts/infrastructure/mappers/shorts.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * ShortsRepositoryImpl
 *
 * @description
 * Wraps the generated short-video client calls, mapping success through
 * `ShortsMapper` and failure through `ProblemMapper.toFailure`. Interaction calls
 * resolve the backend `isSuccess` flag.
 */
export class ShortsRepositoryImpl implements IShortsRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getShortsFeed(query: IShortsFeedQuery): Promise<Result<IShortVideoFeedPage>> {
        try {
            const response = await this.api.getShortsFeed({
                cursor: query.cursor,
                pageSize: query.pageSize
            });
            return ok(ShortsMapper.shortFeedPageFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getShortBySlug(slug: string): Promise<Result<IShortVideoEntity>> {
        try {
            const response = await this.api.getPublicShortBySlug(slug);
            return ok(ShortsMapper.shortFromDto(response.data.shortVideo));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async likeShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicLikeShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async unlikeShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicUnlikeShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async bookmarkShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicBookmarkShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async unbookmarkShort(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicUnbookmarkShortVideo(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async shareShort({ shortId, shareChannel }: IShareShortInput): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicShareShortVideo(shortId, { shareChannel });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async recordShortView(shortId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicRecordShortVideoView(shortId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
