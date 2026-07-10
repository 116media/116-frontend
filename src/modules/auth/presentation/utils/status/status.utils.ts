import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";

/**
 * deriveAuthStatus
 *
 * @description
 * Maps the `me`-query state to the derived auth status using guard clauses: still
 * loading, then no user (guest), then unverified email, otherwise fully authenticated.
 *
 * @param isLoading - Whether the `me` query is still resolving.
 * @param user - The resolved user, or null when there is no session.
 * @returns The derived auth status.
 */
export function deriveAuthStatus(isLoading: boolean, user: IAuthUserEntity | null): AuthStatus {
    if (isLoading) return "loading";
    if (!user) return "guest";
    if (!user.isVerified) return "unverified";
    return "authenticated";
}
