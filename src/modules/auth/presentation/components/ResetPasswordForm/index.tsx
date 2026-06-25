"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useResetPassword } from "@/modules/auth/presentation/hooks/useResetPassword";
import { resetPasswordSchema } from "@/modules/auth/presentation/validation/resetpassword.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

/**
 * ResetPasswordForm
 *
 * @description
 * Sets a new password after the code was verified in the prior verify-otp step.
 * Collects only the new password + a matching confirmation; the email and the
 * verified OTP code come from the modal context. On success the modal returns to the
 * login view. A backend `Failure` shows in the top `Alert`.
 */
export function ResetPasswordForm() {
    const { t } = useTranslation();
    const { context, go } = useAuthModal();
    const { mutate, error, isPending } = useResetPassword();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" }
    });

    const onSubmit = form.handleSubmit((values) => {
        mutate(
            {
                email: context.email ?? "",
                code: context.code ?? "",
                newPassword: values.newPassword
            },
            { onSuccess: () => go("login") }
        );
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
        >
            {error && <Alert error={error} />}

            <FloatingField
                required
                type="password"
                id="reset-new-password"
                autoComplete="new-password"
                label={t("auth.password.newPasswordLabel")}
                error={form.formState.errors.newPassword?.message}
                {...form.register("newPassword")}
            />

            <FloatingField
                required
                type="password"
                id="reset-confirm-password"
                autoComplete="new-password"
                label={t("auth.password.confirmPasswordLabel")}
                error={form.formState.errors.confirmPassword?.message}
                {...form.register("confirmPassword")}
            />

            <Button
                type="submit"
                className="w-full"
                disabled={isPending}
            >
                {t("auth.password.reset")}
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
