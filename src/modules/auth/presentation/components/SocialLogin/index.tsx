"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookProvider } from "react-facebook";
import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useSocialLogin } from "@/modules/auth/presentation/hooks/useSocialLogin";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "@/shared/infrastructure/constants/common";
import { Alert } from "@/shared/presentation/components/ui/Alert";

import { FacebookLoginButton } from "./FacebookLoginButton";
import { GoogleLoginButton } from "./GoogleLoginButton";

/**
 * SocialLogin
 *
 * @description
 * The Google + Facebook sign-in block shared by the login and signup views. Each
 * provider button is mounted only when its client id is configured (and the whole
 * block — including the "or" divider — is hidden when neither is), then wraps the
 * button in the SDK provider it needs. When a button resolves a profile it is sent
 * to the backend via `useSocialLogin`; a success resumes any pending after-login
 * action, and a failure surfaces inline.
 *
 * @returns The social sign-in buttons with divider, or `null` when unconfigured.
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
                        <GoogleLoginButton
                            onProfile={onProfile}
                            disabled={isPending}
                        />
                    </GoogleOAuthProvider>
                )}

                {FACEBOOK_APP_ID && (
                    <FacebookProvider appId={FACEBOOK_APP_ID}>
                        <FacebookLoginButton
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
