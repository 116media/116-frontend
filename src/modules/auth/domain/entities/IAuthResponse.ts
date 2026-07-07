import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";

/**
 * IAuthResponse
 *
 * @description
 * The result of login/signup on the web: just the user (tokens are in httpOnly
 * cookies, never in the body). Maps from `PublicLoginWebResponse` /
 * `PublicSignUpWebResponse`.
 *
 * @interface IAuthResponse
 * @property {IAuthUserEntity} user - The authenticated user.
 * @property {boolean} [verificationRequired] - True after signup when email verification is pending.
 */
export interface IAuthResponse {
    user: IAuthUserEntity;
    verificationRequired?: boolean;
}
