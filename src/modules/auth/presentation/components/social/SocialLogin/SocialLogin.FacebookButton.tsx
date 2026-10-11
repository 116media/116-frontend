"use client";

import { LoginStatus, useLogin } from "react-facebook";
import { useTranslation } from "react-i18next";
import { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FacebookIcon } from "@/shared/presentation/components/ui/Icon";
import type { SocialLoginButtonProps } from "./types";

/**
 * SocialLoginFacebookButton
 *
 * @description
 * Facebook sign-in button. Runs the Facebook JS-SDK login and hands the resulting
 * access token to `onProfile`; the backend verifies it against the Graph API and
 * reads the profile from there. Must be rendered inside a `FacebookProvider`.
 *
 * @param props - See {@link SocialLoginButtonProps}.
 */
export function SocialLoginFacebookButton({
    onProfile,
    disabled,
    loading
}: SocialLoginButtonProps) {
    const { t } = useTranslation();
    const { login, loading: providerLoading } = useLogin();

    const handleClick = async () => {
        const response = await login({ scope: "public_profile,email" });
        if (response.status !== LoginStatus.CONNECTED) return;

        onProfile({
            provider: EAuthProvider.Facebook,
            idToken: response.authResponse.accessToken
        });
    };

    return (
        <Button
            size="lg"
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleClick}
            disabled={disabled}
            loading={loading || providerLoading}
        >
            <FacebookIcon />
            {t("auth.common.continueWithFacebook")}
        </Button>
    );
}
