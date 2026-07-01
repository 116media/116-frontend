/**
 * Purposes for which a one-time password (OTP) can be issued.
 *
 * @enum {string}
 *
 * @description
 * Domain enum mirroring the backend OTP purposes. Sent to the verify/resend
 * endpoints. The web flows use `EmailVerification` (after signup) and
 * `PasswordReset` (forgot/reset password).
 *
 * @property {string} EmailVerification - Verify the email during registration.
 * @property {string} PasswordReset - Recover access via a password reset.
 * @property {string} TwoFactorAuthentication - Second-factor authentication.
 * @property {string} AccountRecovery - Recover a locked/lost account.
 */
export enum EOtpPurpose {
    EmailVerification = "EmailVerification",
    PasswordReset = "PasswordReset",
    TwoFactorAuthentication = "TwoFactorAuthentication",
    AccountRecovery = "AccountRecovery"
}
