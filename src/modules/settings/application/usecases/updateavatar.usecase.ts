import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUpdateAvatarUseCase
 * @extends {IResultUseCase<File, IProfile>}
 */
interface IUpdateAvatarUseCase extends IResultUseCase<File, IProfile> {}

/**
 * Use case for updating the current user's avatar image.
 *
 * @class UpdateAvatarUseCase
 * @implements {IUpdateAvatarUseCase}
 *
 * @description
 * Uploads a single image file to the dedicated avatar endpoint and returns the updated
 * user (with the new avatar URL). The backend replaces any previous avatar.
 */
export class UpdateAvatarUseCase implements IUpdateAvatarUseCase {
    private readonly settingsRepository: ISettingsRepositoryPort;

    /**
     * @param settingsRepository - Repository for settings operations (injected)
     */
    constructor({ settingsRepository }: { settingsRepository: ISettingsRepositoryPort }) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Executes the update-avatar use case.
     *
     * @param file - The image file to upload.
     * @returns {Promise<Result<IProfile>>} `ok(IProfile)` on success, `err(Failure)` on failure
     */
    execute(file: File): Promise<Result<IProfile>> {
        return this.settingsRepository.updateAvatar(file);
    }
}
