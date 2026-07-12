import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IUpdateAccountCredentials } from "@/modules/settings/presentation/model/IUpdateAccountCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IUpdateAccountUseCase
 * @extends {IResultUseCase<IUpdateAccountCredentials, IProfile>}
 */
interface IUpdateAccountUseCase extends IResultUseCase<IUpdateAccountCredentials, IProfile> {}

/**
 * Use case for updating the current user's account/profile.
 *
 * @class UpdateAccountUseCase
 * @implements {IUpdateAccountUseCase}
 *
 * @description
 * Applies a partial profile update and returns the updated user, so the caller can
 * write it straight into the `me` cache (no refetch, no stale data).
 */
export class UpdateAccountUseCase implements IUpdateAccountUseCase {
    private readonly settingsRepository: ISettingsRepositoryPort;

    /**
     * @param settingsRepository - Repository for settings operations (injected)
     */
    constructor({ settingsRepository }: { settingsRepository: ISettingsRepositoryPort }) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Executes the update-account use case.
     *
     * @param credentials - The partial account update
     * @returns {Promise<Result<IProfile>>} `ok(IProfile)` on success, `err(Failure)` on failure
     */
    execute(credentials: IUpdateAccountCredentials): Promise<Result<IProfile>> {
        return this.settingsRepository.updateAccount(credentials);
    }
}
