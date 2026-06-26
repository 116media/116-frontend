"use client";

import { LoginStatus, useFacebook, useLogin } from "react-facebook";
import { useTranslation } from "react-i18next";

import { EAuthProvider } from "@/modules/auth/domain/enums/EAuthProvider";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FacebookIcon } from "@/shared/presentation/icons/FacebookIcon";

/**
 * The Graph API fields requested for the signed-in user after login.
 */
const FACEBOOK_PROFILE_FIELDS = "name,email,picture";

/**
 * FacebookProfile
 *
 * @description
 * The subset of the Graph API `/me` response the backend social-login needs.
 *
 * @interface FacebookProfile
 * @property {string} [name] - The full display name.
 * @property {string} [email] - The account email (only present when the email scope
 * was granted).
 * @property {{ data?: { url?: string } }} [picture] - The avatar payload.
 */
interface FacebookProfile {
    name?: string;
    email?: string;
    picture?: { data?: { url?: string } };
}

/**
 * FacebookLoginButtonProps
 *
 * @description
 * Props for {@link FacebookLoginButton}.
 *
 * @interface FacebookLoginButtonProps
 * @property {(credentials: ISocialLoginCredentials) => void} onProfile - Receives the
 * resolved Facebook profile, ready for the backend social-login call.
 * @property {boolean} [disabled] - Disables the button while a sign-in is in flight.
 */
interface FacebookLoginButtonProps {
    onProfile: (credentials: ISocialLoginCredentials) => void;
    disabled?: boolean;
}

/**
 * FacebookLoginButton
 *
 * @description
 * Custom-styled Facebook button. Runs the Facebook JS-SDK login (public profile +
 * email scope), reads the account profile from the Graph API, and hands `{ email,
 * userName, avatarUrl, provider }` to `onProfile`. Must be rendered inside a
 * `FacebookProvider`.
 *
 * @param props - See {@link FacebookLoginButtonProps}.
 * @returns The Facebook sign-in button.
 */
export function FacebookLoginButton({ onProfile, disabled }: FacebookLoginButtonProps) {
    const { t } = useTranslation();
    const { login, loading } = useLogin();
    const { api } = useFacebook();

    const handleClick = async () => {
        const response = await login({ scope: "public_profile,email" });
        if (response.status !== LoginStatus.CONNECTED || !api) return;

        const profile = (await api.getProfile({
            fields: FACEBOOK_PROFILE_FIELDS
        })) as FacebookProfile;
        if (!profile.email) return;

        onProfile({
            email: profile.email,
            userName: profile.name ?? profile.email,
            avatarUrl: profile.picture?.data?.url,
            provider: EAuthProvider.Facebook
        });
    };

    return (
        <Button
            size="lg"
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleClick}
            disabled={disabled || loading}
        >
            <FacebookIcon />
            {t("auth.common.continueWithFacebook")}
        </Button>
    );
}
