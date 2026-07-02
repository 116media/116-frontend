"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SocialLogin } from "@/modules/auth/presentation/components/SocialLogin";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useLogin } from "@/modules/auth/presentation/hooks/useLogin";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import { loginSchema } from "@/modules/auth/presentation/validation/login.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

/**
 * LoginForm
 *
 * @description
 * Credentials + password login, styled like the kinix auth form: an "or" divider
 * above which the (later) social buttons mount, floating-label fields, a primary
 * block submit, and two text footer links. A backend `Failure` shows in the top
 * `Alert` only when present; client errors render below each field. On success the
 * cache is updated by `useLogin`, the resume action runs, and the modal closes.
 */
export function LoginForm() {
    const { t } = useTranslation();

    const { mutate, error, isPending } = useLogin();
    const { go, runOnSuccess } = useAuthModal();

    const form = useForm<ILoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: { credentials: "", password: "" }
    });

    const onSubmit = form.handleSubmit((values) => {
        mutate(values, { onSuccess: () => runOnSuccess() });
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
        >
            {error && <Alert error={error} />}

            <SocialLogin />

            <FloatingField
                required
                id="credentials"
                autoComplete="username"
                label={t("auth.login.credentialsLabel")}
                error={form.formState.errors.credentials?.message}
                {...form.register("credentials")}
            />

            <FloatingField
                required
                id="password"
                type="password"
                autoComplete="current-password"
                label={t("auth.login.passwordLabel")}
                error={form.formState.errors.password?.message}
                {...form.register("password")}
            />

            <div className="-mt-2 flex justify-end">
                <Button
                    size="sm"
                    type="button"
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => go("forgot-password")}
                >
                    {t("auth.login.forgotPassword")}
                </Button>
            </div>

            <Button
                size="lg"
                type="submit"
                className="w-full"
                loading={isPending}
            >
                {t("auth.login.submit")}
            </Button>

            <div className="flex flex-col items-center gap-1">
                <Button
                    type="button"
                    variant="link"
                    onClick={() => go("signup")}
                >
                    {t("auth.login.noAccount")} {t("auth.login.createAccount")}
                </Button>
            </div>
        </form>
    );
}
