import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IPlaylistDetailEntity } from "@/modules/videos/domain/entities/IPlaylistDetailEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetPlaylistByIdUseCase
 * @extends {IResultUseCase<string, IPlaylistDetailEntity>}
 */
interface IGetPlaylistByIdUseCase extends IResultUseCase<string, IPlaylistDetailEntity> {}

/**
 * Use case for fetching one playlist with its videos.
 *
 * @class GetPlaylistByIdUseCase
 * @implements {IGetPlaylistByIdUseCase}
 *
 * @description
 * Fetches one of the signed-in user's playlists with its ordered videos via the
 * videos repository. Returns the repository's `Result<IPlaylistDetailEntity>`
 * unchanged.
 */
export class GetPlaylistByIdUseCase implements IGetPlaylistByIdUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({
        videosRepository
    }: {
        videosRepository: IVideosRepositoryPort;
    }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-playlist-by-id use case.
     *
     * @param id - The playlist to fetch (UUID)
     * @returns {Promise<Result<IPlaylistDetailEntity>>} `ok(IPlaylistDetailEntity)` on success, `err(Failure)` on failure
     */
    async execute(id: string): Promise<Result<IPlaylistDetailEntity>> {
        return this.videosRepository.getPlaylistById(id);
    }
}
