import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";

/**
 * deriveAuthStatus
 *
 * @description
 * Maps the `me`-query state to the derived auth status using guard clauses: still
 * pending, usable cached user, query failure, guest, then verification state.
 *
 * @param isPending - Whether the `me` query has yet to resolve for the first time.
 * @param isError - Whether session resolution failed without usable cached data.
 * @param user - The resolved user, or null when there is no session.
 * @returns The derived auth status.
 */
export function deriveAuthStatus(
    isPending: boolean,
    isError: boolean,
    user: IAuthUserEntity | null
): AuthStatus {
    if (isPending) return "loading";
    if (!user && isError) return "error";
    if (!user) return "guest";
    if (!user.isVerified) return "unverified";
    return "authenticated";
}
