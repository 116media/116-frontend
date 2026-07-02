import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetVideoLyricsUseCase
 * @extends {IResultUseCase<string, IVideoLyricsEntity>}
 */
interface IGetVideoLyricsUseCase extends IResultUseCase<string, IVideoLyricsEntity> {}

/**
 * Use case for fetching the lyrics linked to a video.
 *
 * @class GetVideoLyricsUseCase
 * @implements {IGetVideoLyricsUseCase}
 *
 * @description
 * Fetches the lyrics linked to one video via the videos repository. A video
 * without lyrics resolves to a 404 failure, which the lyrics tab renders as
 * its empty state. Returns the repository's `Result<IVideoLyricsEntity>`
 * unchanged.
 */
export class GetVideoLyricsUseCase implements IGetVideoLyricsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-video-lyrics use case.
     *
     * @param {string} videoId - The video whose lyrics to fetch (UUID)
     * @returns {Promise<Result<IVideoLyricsEntity>>} `ok(IVideoLyricsEntity)` on success, `err(Failure)` on failure
     */
    async execute(videoId: string): Promise<Result<IVideoLyricsEntity>> {
        return this.videosRepository.getVideoLyrics(videoId);
    }
}
