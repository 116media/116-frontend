"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ForgotPasswordForm } from "@/modules/auth/presentation/components/forms/ForgotPasswordForm";
import { LoginForm } from "@/modules/auth/presentation/components/forms/LoginForm";
import { ResetPasswordForm } from "@/modules/auth/presentation/components/forms/ResetPasswordForm";
import { SignupForm } from "@/modules/auth/presentation/components/forms/SignupForm";
import { VerifyOtpForm } from "@/modules/auth/presentation/components/forms/VerifyOtpForm";
import { VIEW_TITLES } from "@/modules/auth/presentation/constants/authModal";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { ArrowLeftIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * AuthModal
 *
 * @description
 * The single auth dialog; switching views swaps its body in place rather than
 * opening a second modal. A mutation-cache subscription shakes the panel when
 * any `["auth", …]`-keyed mutation errors, so forms never opt in individually.
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
            <DialogContent
                aria-describedby="auth-desc"
                closeLabel={t("auth.common.close")}
            >
                <div
                    onAnimationEnd={(event) => {
                        if (event.animationName === "dialog-shake") setShaking(false);
                    }}
                    className={cn(
                        "relative grid gap-4 rounded-2xl border bg-card p-6 shadow-xl",
                        shaking && "animate-dialog-shake"
                    )}
                >
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
