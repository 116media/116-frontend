import { SocialLogin as SocialLoginRoot } from "./SocialLogin";
import { SocialLoginFacebookButton } from "./SocialLogin.FacebookButton";
import { SocialLoginGoogleButton } from "./SocialLogin.GoogleButton";

/**
 * SocialLogin
 *
 * @description
 * Third-party sign-in: the root lays out the divider and buttons, `.GoogleButton` and
 * `.FacebookButton` own their SDK handshakes.
 */
export const SocialLogin = {
    Root: SocialLoginRoot,
    FacebookButton: SocialLoginFacebookButton,
    GoogleButton: SocialLoginGoogleButton
} as const;
