"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { GoogleIcon } from "@/shared/presentation/components/ui/Icon";
import type { SocialLoginButtonProps } from "./types";

/**
 * Google's OpenID userinfo endpoint. Called with the implicit-flow access token to
 * read the signed-in user's email, name, and avatar.
 */
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

/**
 * GoogleUserInfo
 *
 * @description
 * The subset of Google's userinfo response the backend social-login needs.
 *
 * @interface GoogleUserInfo
 * @property {string} email - The verified account email.
 * @property {string} [name] - The full display name.
 * @property {string} [given_name] - The first name (preferred as the userName).
 * @property {string} [picture] - The avatar URL.
 */
interface GoogleUserInfo {
    email: string;
    name?: string;
    given_name?: string;
    picture?: string;
}

/**
 * SocialLoginGoogleButton
 *
 * @description
 * Google sign-in button. Runs the Google Identity Services implicit OAuth flow,
 * reads the account profile from the userinfo endpoint, and hands the resolved
 * credentials to `onProfile`. Must be rendered inside a `GoogleOAuthProvider`.
 *
 * @param props - See {@link SocialLoginButtonProps}.
 */
export function SocialLoginGoogleButton({ onProfile, disabled }: SocialLoginButtonProps) {
    const { t } = useTranslation();

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            const result = await fetch(GOOGLE_USERINFO_URL, {
                headers: { Authorization: `Bearer ${response.access_token}` }
            });
            if (!result.ok) return;

            const info = (await result.json()) as GoogleUserInfo;
            if (!info.email) return;

            onProfile({
                email: info.email,
                userName: info.given_name ?? info.name ?? info.email,
                avatarUrl: info.picture,
                provider: EAuthProvider.Google
            });
        }
    });

    return (
        <Button
            size="lg"
            type="button"
            variant="outline"
            className="w-full"
            loading={disabled}
            onClick={() => login()}
        >
            <GoogleIcon />
            {t("auth.common.continueWithGoogle")}
        </Button>
    );
}
