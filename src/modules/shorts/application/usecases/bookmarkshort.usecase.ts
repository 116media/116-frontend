import type { IShortsRepositoryPort } from "@/modules/shorts/application/repositories/shorts.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IBookmarkShortUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface IBookmarkShortUseCase extends IResultUseCase<string, boolean> {}

/**
 * BookmarkShortUseCase
 *
 * @class BookmarkShortUseCase
 * @implements {IBookmarkShortUseCase}
 *
 * @description
 * Records the signed-in user's bookmark on a short via the shorts repository.
 */
export class BookmarkShortUseCase implements IBookmarkShortUseCase {
    private readonly shortsRepository: IShortsRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.shortsRepository - The shorts repository (injected).
     */
    constructor({ shortsRepository }: { shortsRepository: IShortsRepositoryPort }) {
        this.shortsRepository = shortsRepository;
    }

    /**
     * Executes the bookmark-short use case.
     *
     * @param shortId - The short to bookmark.
     * @returns {Promise<Result<boolean>>} The success flag or a failure.
     */
    execute(shortId: string): Promise<Result<boolean>> {
        return this.shortsRepository.bookmarkShort(shortId);
    }
}
