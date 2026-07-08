import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { IChangePasswordResponse } from "@/modules/settings/domain/entities/IChangePasswordResponse";
import type { IChangePasswordCredentials } from "@/modules/settings/presentation/model/IChangePasswordCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IChangePasswordUseCase
 * @extends {IResultUseCase<IChangePasswordCredentials, IChangePasswordResponse>}
 */
interface IChangePasswordUseCase
    extends IResultUseCase<IChangePasswordCredentials, IChangePasswordResponse> {}

/**
 * Use case for changing the current user's password.
 *
 * @class ChangePasswordUseCase
 * @implements {IChangePasswordUseCase}
 *
 * @description
 * Changes the password while signed in (current password + new password).
 */
export class ChangePasswordUseCase implements IChangePasswordUseCase {
    private readonly settingsRepository: ISettingsRepositoryPort;

    /**
     * @param settingsRepository - Repository for settings operations (injected)
     */
    constructor({ settingsRepository }: { settingsRepository: ISettingsRepositoryPort }) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Executes the change-password use case.
     *
     * @param credentials - Current + new password
     * @returns {Promise<Result<IChangePasswordResponse>>} `ok` on success, `err(Failure)` on failure
     */
    execute(credentials: IChangePasswordCredentials): Promise<Result<IChangePasswordResponse>> {
        return this.settingsRepository.changePassword(credentials);
    }
}
