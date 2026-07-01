/**
 * IForgotPasswordCredentials
 *
 * @description Presentation-layer input for initiating password recovery.
 * @interface IForgotPasswordCredentials
 * @property {string} email - Account email.
 */
export interface IForgotPasswordCredentials {
    email: string;
}
