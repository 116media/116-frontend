"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookProvider } from "react-facebook";
import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useSocialLogin } from "@/modules/auth/presentation/hooks/useSocialLogin";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "@/shared/infrastructure/constants/common";
import { Alert } from "@/shared/presentation/components/ui/Alert";

import { SocialLoginFacebookButton } from "./SocialLogin.FacebookButton";
import { SocialLoginGoogleButton } from "./SocialLogin.GoogleButton";

/**
 * SocialLogin
 *
 * @description
 * Google + Facebook sign-in block shared by the login and signup views. Each
 * provider button mounts only when its client id is configured; resolved
 * profiles go to the backend via `useSocialLogin`. Failures surface inline.
 */
export function SocialLogin() {
    const { t } = useTranslation();
    const { runOnSuccess } = useAuthModal();
    const { mutate, error, isPending } = useSocialLogin();

    if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) return null;

    const onProfile = (credentials: ISocialLoginCredentials) => {
        mutate(credentials, { onSuccess: () => runOnSuccess() });
    };

    return (
        <div className="flex flex-col gap-4">
            {error && <Alert error={error} />}

            <div className="flex flex-col gap-2">
                {GOOGLE_CLIENT_ID && (
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <SocialLoginGoogleButton
                            onProfile={onProfile}
                            disabled={isPending}
                        />
                    </GoogleOAuthProvider>
                )}

                {FACEBOOK_APP_ID && (
                    <FacebookProvider appId={FACEBOOK_APP_ID}>
                        <SocialLoginFacebookButton
                            onProfile={onProfile}
                            disabled={isPending}
                        />
                    </FacebookProvider>
                )}
            </div>

            <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("auth.common.or")}
                <span className="h-px flex-1 bg-border" />
            </div>
        </div>
    );
}
