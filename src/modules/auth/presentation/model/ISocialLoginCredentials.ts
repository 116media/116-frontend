import type { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";

/**
 * ISocialLoginCredentials
 *
 * @description
 * Presentation-layer input for social (Google/Facebook) login. The backend verifies
 * the provider token itself and reads the identity from it, so the client sends only
 * the provider and its token — never an email or profile it could forge.
 *
 * @interface ISocialLoginCredentials
 * @property {EAuthProvider} provider - The social provider (`Google` or `Facebook`).
 * @property {string} idToken - The provider-issued token the backend verifies.
 */
export interface ISocialLoginCredentials {
    provider: EAuthProvider;
    idToken: string;
}
