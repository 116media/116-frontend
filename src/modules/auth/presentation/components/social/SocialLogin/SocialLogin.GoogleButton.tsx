"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { GoogleIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SocialLoginButtonProps } from "./types";

/**
 * Widest button Google Identity Services will render.
 */
const GOOGLE_MAX_WIDTH = 400;

/**
 * SocialLoginGoogleButton
 *
 * @description
 * Google sign-in button. Google Identity Services renders its own button because
 * it is the only flow returning an ID token, which the API verifies before it
 * trusts any identity; that button is laid transparently over ours so the two
 * providers match. Must be rendered inside a `GoogleOAuthProvider`.
 *
 * @param props - See {@link SocialLoginButtonProps}.
 */
export function SocialLoginGoogleButton({ onProfile, disabled, loading }: SocialLoginButtonProps) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(GOOGLE_MAX_WIDTH);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(Math.min(Math.round(entry.contentRect.width), GOOGLE_MAX_WIDTH));
        });
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    const isBlocked = disabled || loading;

    return (
        <div
            ref={containerRef}
            className="group relative w-full"
        >
            <Button
                size="lg"
                type="button"
                variant="outline"
                loading={loading}
                disabled={isBlocked}
                aria-hidden={!isBlocked}
                tabIndex={isBlocked ? undefined : -1}
                className={cn(
                    "pointer-events-none w-full",
                    "group-hover:bg-accent group-hover:text-accent-foreground",
                    "group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-ring"
                )}
            >
                <GoogleIcon />
                {t("auth.common.continueWithGoogle")}
            </Button>

            {!isBlocked && (
                <div className="absolute inset-0 cursor-pointer overflow-hidden opacity-0 [&>div]:w-full">
                    <GoogleLogin
                        theme="outline"
                        size="large"
                        width={width}
                        shape="rectangular"
                        text="continue_with"
                        logo_alignment="center"
                        onSuccess={({ credential }) => {
                            if (!credential) return;
                            onProfile({ provider: EAuthProvider.Google, idToken: credential });
                        }}
                    />
                </div>
            )}
        </div>
    );
}
