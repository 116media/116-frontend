/**
 * ISignupCredentials
 *
 * @description Presentation-layer input for the signup form / use case.
 * @interface ISignupCredentials
 * @property {string} email - User email.
 * @property {string} userName - Desired username.
 * @property {string} password - Plaintext password.
 */
export interface ISignupCredentials {
    email: string;
    userName: string;
    password: string;
}
