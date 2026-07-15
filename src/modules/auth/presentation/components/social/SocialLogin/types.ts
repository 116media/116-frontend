import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";

/**
 * Props shared by the Google and Facebook sign-in buttons.
 *
 * @interface SocialLoginButtonProps
 * @property {(credentials: ISocialLoginCredentials) => void} onProfile - Receives the
 * resolved provider profile, ready for the backend social-login call.
 * @property {boolean} [disabled] - Disables the button while a sign-in is in flight.
 * @property {boolean} [loading] - Shows the loading state for this provider.
 */
export interface SocialLoginButtonProps {
    onProfile: (credentials: ISocialLoginCredentials) => void;
    disabled?: boolean;
    loading?: boolean;
}
