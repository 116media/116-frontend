/**
 * Authentication providers a user account can use.
 *
 * @enum {string}
 *
 * @description
 * Domain enum mirroring the backend `EnumAuthProvider`. Drives which login path an
 * account authenticates through (local credentials or a social provider).
 *
 * @property {string} Local - Email/username + password.
 * @property {string} Google - Google OAuth.
 * @property {string} Facebook - Facebook OAuth.
 */
export enum EAuthProvider {
    Local = "Local",
    Google = "Google",
    Facebook = "Facebook"
}
