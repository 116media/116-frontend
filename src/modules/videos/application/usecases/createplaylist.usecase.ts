import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ICreatePlaylistUseCase
 * @extends {IResultUseCase<string, IPlaylistEntity>}
 */
interface ICreatePlaylistUseCase extends IResultUseCase<string, IPlaylistEntity> {}

/**
 * Use case for creating a playlist.
 *
 * @class CreatePlaylistUseCase
 * @implements {ICreatePlaylistUseCase}
 *
 * @description
 * Creates a new playlist owned by the signed-in user via the videos
 * repository. Returns the repository's `Result<IPlaylistEntity>` (the created
 * playlist) unchanged.
 */
export class CreatePlaylistUseCase implements ICreatePlaylistUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the create playlist use case.
     *
     * @param {string} name - The playlist name
     * @returns {Promise<Result<IPlaylistEntity>>} `ok(IPlaylistEntity)` on success, `err(Failure)` on failure
     */
    async execute(name: string): Promise<Result<IPlaylistEntity>> {
        return this.videosRepository.createPlaylist(name);
    }
}
