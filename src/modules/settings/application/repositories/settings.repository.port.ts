import type { IChangePasswordResponse } from "@/modules/settings/domain/entities/IChangePasswordResponse";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IChangePasswordCredentials } from "@/modules/settings/presentation/model/IChangePasswordCredentials";
import type { IUpdateAccountCredentials } from "@/modules/settings/presentation/model/IUpdateAccountCredentials";
import type { Result } from "@/shared/domain/results/result";

/**
 * Repository port for the signed-in user's settings.
 *
 * @interface ISettingsRepositoryPort
 *
 * @description
 * Contract for the current user's account operations — profile retrieval and
 * update, plus password change. All methods return `Result<T>`; errors are typed
 * `Failure` values, never thrown.
 */
export interface ISettingsRepositoryPort {
    /**
     * Fetches the current user's profile (cookie-authenticated).
     *
     * @returns `ok(IProfile)` on success, `err(Failure)` on failure
     */
    getProfile(): Promise<Result<IProfile>>;

    /**
     * Applies a partial account/profile update and returns the updated user.
     *
     * @param credentials - The partial account update
     * @returns `ok(IProfile)` on success, `err(Failure)` on failure
     */
    updateAccount(credentials: IUpdateAccountCredentials): Promise<Result<IProfile>>;

    /**
     * Changes the password while signed in.
     *
     * @param credentials - Current password + new password
     * @returns `ok(IChangePasswordResponse)` on success, `err(Failure)` on failure
     */
    changePassword(
        credentials: IChangePasswordCredentials
    ): Promise<Result<IChangePasswordResponse>>;
}
