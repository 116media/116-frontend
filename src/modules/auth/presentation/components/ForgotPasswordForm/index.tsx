"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useForgotPassword } from "@/modules/auth/presentation/hooks/useForgotPassword";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import { forgotPasswordSchema } from "@/modules/auth/presentation/validation/forgotpassword.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

/**
 * ForgotPasswordForm
 *
 * @description
 * Requests a password-recovery OTP for an account email. On success the modal
 * advances to the reset-password view, carrying the email in context.
 */
export function ForgotPasswordForm() {
    const { t } = useTranslation();

    const { go } = useAuthModal();
    const { mutate, error, isPending } = useForgotPassword();

    const form = useForm<IForgotPasswordCredentials>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    });

    const onSubmit = form.handleSubmit((values) => {
        mutate(values, {
            onSuccess: (data) =>
                go("verify-otp", { email: data.email, purpose: EOtpPurpose.PasswordReset })
        });
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
        >
            {error && <Alert error={error} />}

            <FloatingField
                required
                type="email"
                id="forgot-email"
                autoComplete="email"
                label={t("auth.password.emailLabel")}
                error={form.formState.errors.email?.message}
                {...form.register("email")}
            />

            <Button
                type="submit"
                className="w-full"
                disabled={isPending}
            >
                {t("auth.password.sendCode")}
            </Button>

            <div className="flex flex-col items-center gap-1">
                <Button
                    size="sm"
                    type="button"
                    variant="link"
                    onClick={() => go("login")}
                >
                    {t("auth.signup.login")}
                </Button>
            </div>
        </form>
    );
}
