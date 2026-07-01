"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";
import { SocialLogin } from "@/modules/auth/presentation/components/SocialLogin";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useSignup } from "@/modules/auth/presentation/hooks/useSignup";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import { signupSchema } from "@/modules/auth/presentation/validation/signup.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

/**
 * SignupForm
 *
 * @description
 * Email + username + password registration. On success the user is created
 * (unverified) and the modal advances to the verify-otp view with an
 * `EmailVerification` purpose. Backend errors show in the top `Alert`.
 */
export function SignupForm() {
    const { t } = useTranslation();

    const { go } = useAuthModal();
    const { mutate, error, isPending } = useSignup();

    const form = useForm<ISignupCredentials>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: "", userName: "", password: "" }
    });

    const onSubmit = form.handleSubmit((values) => {
        mutate(values, {
            onSuccess: () =>
                go("verify-otp", { email: values.email, purpose: EOtpPurpose.EmailVerification })
        });
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
                type="email"
                id="signup-email"
                autoComplete="email"
                label={t("auth.signup.emailLabel")}
                error={form.formState.errors.email?.message}
                {...form.register("email")}
            />

            <FloatingField
                required
                id="signup-username"
                autoComplete="username"
                label={t("auth.signup.userNameLabel")}
                error={form.formState.errors.userName?.message}
                {...form.register("userName")}
            />

            <FloatingField
                required
                type="password"
                id="signup-password"
                autoComplete="new-password"
                label={t("auth.signup.passwordLabel")}
                error={form.formState.errors.password?.message}
                {...form.register("password")}
            />

            <Button
                size="lg"
                type="submit"
                className="w-full"
                disabled={isPending}
            >
                {t("auth.signup.submit")}
            </Button>

            <div className="flex flex-col items-center gap-1">
                <Button
                    size="lg"
                    type="button"
                    variant="link"
                    onClick={() => go("login")}
                >
                    {t("auth.signup.haveAccount")} {t("auth.signup.login")}
                </Button>
            </div>
        </form>
    );
}
