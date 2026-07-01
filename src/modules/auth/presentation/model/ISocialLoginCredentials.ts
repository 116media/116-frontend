import type { EAuthProvider } from "@/modules/auth/domain/enums/EAuthProvider";

/**
 * ISocialLoginCredentials
 *
 * @description
 * Presentation-layer input for social (Google/Facebook) login — the profile fields
 * obtained from the OAuth provider and posted to the backend's `publicSocialLogin`.
 * The backend auto-verifies social accounts and downloads the avatar if present.
 *
 * @interface ISocialLoginCredentials
 * @property {string} email - Email from the social provider.
 * @property {string} userName - Display name from the social provider.
 * @property {string} [avatarUrl] - Optional avatar URL from the social provider.
 * @property {EAuthProvider} provider - The social provider (`Google` or `Facebook`).
 */
export interface ISocialLoginCredentials {
    email: string;
    userName: string;
    avatarUrl?: string;
    provider: EAuthProvider;
}
