import type {
    IRemoveVideoFromPlaylistInput,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IRemoveVideoFromPlaylistUseCase
 * @extends {IResultUseCase<IRemoveVideoFromPlaylistInput, boolean>}
 */
interface IRemoveVideoFromPlaylistUseCase
    extends IResultUseCase<IRemoveVideoFromPlaylistInput, boolean> {}

/**
 * Use case for removing a video from a playlist.
 *
 * @class RemoveVideoFromPlaylistUseCase
 * @implements {IRemoveVideoFromPlaylistUseCase}
 *
 * @description
 * Removes one video from one of the signed-in user's playlists via the videos
 * repository. Returns the repository's `Result<boolean>` (success flag)
 * unchanged.
 */
export class RemoveVideoFromPlaylistUseCase implements IRemoveVideoFromPlaylistUseCase {
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
     * Executes the remove-video-from-playlist use case.
     *
     * @param input - The playlist and the video being removed
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(input: IRemoveVideoFromPlaylistInput): Promise<Result<boolean>> {
        return this.videosRepository.removeVideoFromPlaylist(input);
    }
}
