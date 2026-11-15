"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccountVerified } from "@/modules/auth/presentation/components/feedback/AccountVerified";
import { ForgotPasswordForm } from "@/modules/auth/presentation/components/forms/ForgotPasswordForm";
import { LoginForm } from "@/modules/auth/presentation/components/forms/LoginForm";
import { ResetPasswordForm } from "@/modules/auth/presentation/components/forms/ResetPasswordForm";
import { SignupForm } from "@/modules/auth/presentation/components/forms/SignupForm";
import { VerifyOtpForm } from "@/modules/auth/presentation/components/forms/VerifyOtpForm";
import { VIEW_TITLES } from "@/modules/auth/presentation/constants/authModal";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { ArrowLeftIcon } from "@/shared/presentation/components/ui/Icon";
import { AdaptiveDialog } from "@/shared/presentation/components/ui/Sheet";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * AuthModal
 *
 * @description
 * The single auth surface: a bottom sheet on phones and a centred dialog from `sm` up,
 * the same element either way so a half-filled form survives a rotation. Switching views
 * swaps its body in place rather than opening a second modal, and a mutation-cache
 * subscription shakes the panel when any `["auth", …]`-keyed mutation errors, so forms
 * never opt in individually.
 */
export function AuthModal() {
    const { t } = useTranslation();
    const { isOpen, view, canGoBack, close, back } = useAuthModal();

    const queryClient = useQueryClient();
    const { title, subtitle } = VIEW_TITLES[view];

    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        return queryClient.getMutationCache().subscribe((event) => {
            const isAuthError =
                event.type === "updated" &&
                event.action.type === "error" &&
                event.mutation.options.mutationKey?.[0] === "auth";

            if (isAuthError) setShaking(true);
        });
    }, [queryClient]);

    return (
        <AdaptiveDialog.Root
            open={isOpen}
            onOpenChange={(open) => !open && close()}
        >
            <AdaptiveDialog.Content
                detent="fit"
                className={cn(shaking && "animate-dialog-shake")}
                onAnimationEnd={(event) => {
                    if (event.animationName === "dialog-shake") setShaking(false);
                }}
            >
                <AdaptiveDialog.Header
                    closeLabel={t("auth.common.close")}
                    title={<span suppressHydrationWarning>{t(title)}</span>}
                    description={<span suppressHydrationWarning>{t(subtitle)}</span>}
                    leading={
                        canGoBack && (
                            <button
                                type="button"
                                onClick={back}
                                aria-label={t("auth.common.back")}
                                className="shrink-0 self-start pt-2 cursor-pointer rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <ArrowLeftIcon className="size-4.5" />
                            </button>
                        )
                    }
                />

                <AdaptiveDialog.Body className="pt-4 pb-6">
                    {view === "login" && <LoginForm />}
                    {view === "signup" && <SignupForm />}
                    {view === "verify-otp" && <VerifyOtpForm />}
                    {view === "verified" && <AccountVerified />}
                    {view === "forgot-password" && <ForgotPasswordForm />}
                    {view === "reset-password" && <ResetPasswordForm />}
                </AdaptiveDialog.Body>
            </AdaptiveDialog.Content>
        </AdaptiveDialog.Root>
    );
}
