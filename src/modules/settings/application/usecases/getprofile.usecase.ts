import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetProfileUseCase
 * @extends {IResultUseCase<void, IProfile>}
 */
interface IGetProfileUseCase extends IResultUseCase<void, IProfile> {}

/**
 * Use case for fetching the current user's profile.
 *
 * @class GetProfileUseCase
 * @implements {IGetProfileUseCase}
 *
 * @description
 * Resolves the signed-in user (cookie-authenticated). Serves the `me` query and the
 * SSR hydration of the current user.
 */
export class GetProfileUseCase implements IGetProfileUseCase {
    private readonly settingsRepository: ISettingsRepositoryPort;

    /**
     * @param {ISettingsRepositoryPort} settingsRepository - Repository for settings operations (injected)
     */
    constructor({ settingsRepository }: { settingsRepository: ISettingsRepositoryPort }) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Executes the get-profile use case.
     *
     * @returns {Promise<Result<IProfile>>} `ok(IProfile)` on success, `err(Failure)` on failure
     */
    execute(): Promise<Result<IProfile>> {
        return this.settingsRepository.getProfile();
    }
}
