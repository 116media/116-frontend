/**
 * IResetPasswordCredentials
 *
 * @description Presentation-layer input for completing a password reset.
 * @interface IResetPasswordCredentials
 * @property {string} email - Account email.
 * @property {string} code - Recovery OTP code.
 * @property {string} newPassword - The new password.
 */
export interface IResetPasswordCredentials {
    email: string;
    code: string;
    newPassword: string;
}
