"use client";

import { ArrowLeft } from "lucide-react";
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
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";

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
 * The single auth dialog. Renders the active view inside one themed `Dialog`;
 * switching views swaps this body in place — it never opens a second modal. A back
 * button appears whenever there is a previous view to return to. Title + subtitle
 * are centered (kinix parity).
 */
export function AuthModal() {
    const { t } = useTranslation();
    const { isOpen, view, canGoBack, close, back } = useAuthModal();
    const { title, subtitle } = VIEW_TITLES[view];

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => !open && close()}
        >
            <DialogContent aria-describedby="auth-desc">
                <DialogHeader>
                    {canGoBack && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={back}
                            aria-label={t("auth.common.back")}
                            className="absolute left-3 top-3"
                        >
                            <ArrowLeft />
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
            </DialogContent>
        </Dialog>
    );
}
