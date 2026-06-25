import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import type { ISession } from "@/modules/auth/domain/entities/ISession";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISessionRepositoryPort
 *
 * @description
 * Session operations. `refreshToken` MUST use a bare axios client (no interceptors)
 * to avoid refresh recursion, and stays Promise/throw-based (no `Result` wrapper)
 * because the expiry interceptor relies on a thrown rejection to know the refresh
 * failed — matching the dashboard's `SessionRepositoryPort.refreshToken`.
 *
 * @interface ISessionRepositoryPort
 */
export interface ISessionRepositoryPort {
    /**
     * Refreshes the access token from the refresh-token cookie.
     *
     * @returns Resolves on success; rejects on failure (throw-based, no `Result`).
     */
    refreshToken(): Promise<void>;

    /**
     * Lists the current user's sessions.
     *
     * @param isActive - Optional filter for active sessions only.
     * @returns `ok(ISession[])` on success, `err(Failure)` on failure
     */
    getSessions(isActive?: boolean): Promise<Result<ISession[]>>;

    /**
     * Revokes a single device session, disconnecting that device.
     *
     * @param id - The session id to revoke.
     * @returns `ok(IRevokeSessionResponse)` on success, `err(Failure)` on failure
     */
    revokeSession(id: string): Promise<Result<IRevokeSessionResponse>>;
}
