import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IDeletePlaylistUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IDeletePlaylistUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for deleting a playlist.
 *
 * @class DeletePlaylistUseCase
 * @implements {IDeletePlaylistUseCase}
 *
 * @description
 * Permanently deletes one of the signed-in user's playlists via the videos
 * repository. Returns the repository's `Result<boolean>` (success flag)
 * unchanged.
 */
export class DeletePlaylistUseCase implements IDeletePlaylistUseCase {
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
     * Executes the delete-playlist use case.
     *
     * @param id - The playlist to delete (UUID)
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(id: string): Promise<Result<boolean>> {
        return this.videosRepository.deletePlaylist(id);
    }
}
