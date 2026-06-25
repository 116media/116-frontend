/**
 * ILoginCredentials
 *
 * @description Presentation-layer input for the login form / use case.
 * @interface ILoginCredentials
 * @property {string} credentials - Email or username.
 * @property {string} password - Plaintext password (transmitted over HTTPS).
 */
export interface ILoginCredentials {
    credentials: string;
    password: string;
}
