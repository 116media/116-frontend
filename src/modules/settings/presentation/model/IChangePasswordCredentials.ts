/**
 * IChangePasswordCredentials
 *
 * @description Presentation-layer input for changing the password while signed in.
 * @interface IChangePasswordCredentials
 * @property {string} oldPassword - Current password.
 * @property {string} newPassword - The new password.
 */
export interface IChangePasswordCredentials {
    oldPassword: string;
    newPassword: string;
}
