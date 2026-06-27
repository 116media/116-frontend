"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

import { changePasswordSchema } from "@/modules/auth/presentation/validation/changepassword.schema";
import { SettingsCard } from "@/modules/settings/presentation/components/SettingsCard";
import { useChangePassword } from "@/modules/settings/presentation/hooks/useChangePassword";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

/**
 * The change-password form values — current password, new password, and confirmation.
 */
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * ChangePasswordForm
 *
 * @description
 * The Security tab's change-password block. Three password fields validated by the
 * shared `changePasswordSchema` (strong new password, matching confirmation), wrapped
 * in a `SettingsCard`. Only `oldPassword` + `newPassword` are sent; the confirmation
 * is client-side only. A backend `Failure` renders in the top `Alert`; the form resets
 * on success and `useChangePassword` toasts.
 */
export function ChangePasswordForm() {
    const { t } = useTranslation();
    const { mutate, error, isPending } = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" }
    });

    const onSubmit = form.handleSubmit(({ oldPassword, newPassword }) => {
        mutate({ oldPassword, newPassword }, { onSuccess: () => form.reset() });
    });

    return (
        <SettingsCard
            className="lg:max-w-xl"
            title={t("settings.security.password.title")}
            subtitle={t("settings.security.password.subtitle")}
        >
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-4"
            >
                {error && <Alert error={error} />}

                <FloatingField
                    required
                    id="oldPassword"
                    type="password"
                    autoComplete="current-password"
                    label={t("settings.security.password.current")}
                    error={form.formState.errors.oldPassword?.message}
                    {...form.register("oldPassword")}
                />

                <FloatingField
                    required
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    label={t("settings.security.password.new")}
                    error={form.formState.errors.newPassword?.message}
                    {...form.register("newPassword")}
                />

                <FloatingField
                    required
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    label={t("settings.security.password.confirm")}
                    error={form.formState.errors.confirmPassword?.message}
                    {...form.register("confirmPassword")}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        {t("settings.security.password.submit")}
                    </Button>
                </div>
            </form>
        </SettingsCard>
    );
}
