import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetMyPlaylistsUseCase
 * @extends {IResultUseCase<void, IPlaylistEntity[]>}
 */
interface IGetMyPlaylistsUseCase extends IResultUseCase<void, IPlaylistEntity[]> {}

/**
 * Use case for fetching the signed-in user's playlists.
 *
 * @class GetMyPlaylistsUseCase
 * @implements {IGetMyPlaylistsUseCase}
 *
 * @description
 * Fetches all playlists owned by the signed-in user via the videos
 * repository, for the add-to-playlist modal. Returns the repository's
 * `Result<IPlaylistEntity[]>` unchanged.
 */
export class GetMyPlaylistsUseCase implements IGetMyPlaylistsUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the get-my-playlists use case.
     *
     * @returns {Promise<Result<IPlaylistEntity[]>>} `ok(IPlaylistEntity[])` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<IPlaylistEntity[]>> {
        return this.videosRepository.getMyPlaylists();
    }
}
