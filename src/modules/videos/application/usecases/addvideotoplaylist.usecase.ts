import type {
    IAddVideoToPlaylistInput,
    IVideosRepositoryPort
} from "@/modules/videos/application/repositories/videos.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IAddVideoToPlaylistUseCase
 * @extends {IResultUseCase<IAddVideoToPlaylistInput, boolean>}
 */
interface IAddVideoToPlaylistUseCase extends IResultUseCase<IAddVideoToPlaylistInput, boolean> {}

/**
 * Use case for adding a video to a playlist.
 *
 * @class AddVideoToPlaylistUseCase
 * @implements {IAddVideoToPlaylistUseCase}
 *
 * @description
 * Adds one video to one of the signed-in user's playlists via the videos
 * repository. Returns the repository's `Result<boolean>` (success flag)
 * unchanged. The add-to-playlist modal fans this use case out over every
 * selected playlist.
 */
export class AddVideoToPlaylistUseCase implements IAddVideoToPlaylistUseCase {
    private readonly videosRepository: IVideosRepositoryPort;

    /**
     * @param {IVideosRepositoryPort} videosRepository - Repository for videos operations (injected)
     */
    constructor({ videosRepository }: { videosRepository: IVideosRepositoryPort }) {
        this.videosRepository = videosRepository;
    }

    /**
     * Executes the add-video-to-playlist use case.
     *
     * @param {IAddVideoToPlaylistInput} input - The playlist, video, and target position
     * @returns {Promise<Result<boolean>>} `ok(boolean)` success flag on success, `err(Failure)` on failure
     */
    async execute(input: IAddVideoToPlaylistInput): Promise<Result<boolean>> {
        return this.videosRepository.addVideoToPlaylist(input);
    }
}
