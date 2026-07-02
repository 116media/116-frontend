"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPasswordForm } from "@/modules/auth/presentation/components/ForgotPasswordForm";
import { LoginForm } from "@/modules/auth/presentation/components/LoginForm";
import { ResetPasswordForm } from "@/modules/auth/presentation/components/ResetPasswordForm";
import { SignupForm } from "@/modules/auth/presentation/components/SignupForm";
import { VerifyOtpForm } from "@/modules/auth/presentation/components/VerifyOtpForm";
import { type AuthView, useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { ArrowLeftIcon, XCircleIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * The i18n title + subtitle key for each view. `as const satisfies` keeps the keys
 * literal (so the typed `t()` accepts them) while ensuring every view is covered.
 * Forgot and reset get distinct copy even though they share the `password` namespace.
 */
const VIEW_TITLES = {
    login: { title: "auth.login.title", subtitle: "auth.login.subtitle" },
    signup: { title: "auth.signup.title", subtitle: "auth.signup.subtitle" },
    "verify-otp": { title: "auth.otp.title", subtitle: "auth.otp.subtitle" },
    "forgot-password": {
        title: "auth.password.forgotTitle",
        subtitle: "auth.password.forgotSubtitle"
    },
    "reset-password": { title: "auth.password.resetTitle", subtitle: "auth.password.resetSubtitle" }
} as const satisfies Record<AuthView, { title: string; subtitle: string }>;

/**
 * AuthModal
 *
 * @description
 * The single auth dialog. Renders the active view inside one themed panel; switching
 * views swaps this body in place — it never opens a second modal. A back button
 * appears whenever there is a previous view to return to. Title + subtitle are
 * centered (kinix parity). The panel (card + close) lives here, not in the generic
 * `DialogContent`. The error shake is driven by a single subscription to the mutation
 * cache: whenever any `["auth", …]`-keyed mutation transitions to `error`, the panel
 * replays a brief horizontal wobble — so no form has to opt in, and a new form is
 * covered automatically.
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
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && close()}
        >
            <DialogContent aria-describedby="auth-desc">
                <div
                    onAnimationEnd={(event) => {
                        if (event.animationName === "dialog-shake") setShaking(false);
                    }}
                    className={cn(
                        "relative grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl",
                        shaking && "animate-dialog-shake"
                    )}
                >
                    <DialogClose
                        className="absolute right-4 top-4 cursor-pointer rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={t("auth.common.close")}
                    >
                        <XCircleIcon className="size-5" />
                    </DialogClose>

                    <DialogHeader>
                        {canGoBack && (
                            <Button
                                size="icon"
                                type="button"
                                variant="ghost"
                                onClick={back}
                                aria-label={t("auth.common.back")}
                                className="absolute left-3 top-3"
                            >
                                <ArrowLeftIcon />
                            </Button>
                        )}
                        <DialogTitle
                            className="text-center"
                            suppressHydrationWarning
                        >
                            {t(title)}
                        </DialogTitle>
                        <DialogDescription
                            id="auth-desc"
                            className="text-center"
                            suppressHydrationWarning
                        >
                            {t(subtitle)}
                        </DialogDescription>
                    </DialogHeader>

                    {view === "login" && <LoginForm />}
                    {view === "signup" && <SignupForm />}
                    {view === "verify-otp" && <VerifyOtpForm />}
                    {view === "forgot-password" && <ForgotPasswordForm />}
                    {view === "reset-password" && <ResetPasswordForm />}
                </div>
            </DialogContent>
        </Dialog>
    );
}
