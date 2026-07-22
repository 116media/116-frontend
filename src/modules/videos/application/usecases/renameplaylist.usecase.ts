import type {
    IRenamePlaylistInput,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IRenamePlaylistUseCase
 * @extends {IResultUseCase<IRenamePlaylistInput, boolean>}
 */
interface IRenamePlaylistUseCase extends IResultUseCase<IRenamePlaylistInput, boolean> {}

/**
 * Use case for renaming a playlist.
 *
 * @class RenamePlaylistUseCase
 * @implements {IRenamePlaylistUseCase}
 *
 * @description
 * Renames one of the signed-in user's playlists via the videos repository.
 * Returns the repository's `Result<boolean>` (success flag) unchanged.
 */
export class RenamePlaylistUseCase implements IRenamePlaylistUseCase {
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
     * Executes the rename-playlist use case.
     *
     * @param input - The playlist and its new name
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(input: IRenamePlaylistInput): Promise<Result<boolean>> {
        return this.videosRepository.renamePlaylist(input);
    }
}
