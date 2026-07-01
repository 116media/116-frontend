import type { IAuthUser } from "@/modules/auth/domain/entities/IAuthUser";

/**
 * IAuthResponse
 *
 * @description
 * The result of login/signup on the web: just the user (tokens are in httpOnly
 * cookies, never in the body). Named after mobile's `AuthResponse`. Maps from
 * `PublicLoginWebResponse` / `PublicSignUpWebResponse`.
 *
 * @interface IAuthResponse
 * @property {IAuthUser} user - The authenticated user.
 * @property {boolean} [verificationRequired] - True after signup when email verification is pending.
 */
export interface IAuthResponse {
    user: IAuthUser;
    verificationRequired?: boolean;
}
