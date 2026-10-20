"use client";

import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useLogin } from "@/modules/auth/presentation/hooks/useLogin";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CircleCheckIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * AccountVerified
 *
 * @description
 * Confirms the verification inside the modal instead of closing on it, and signs the reader
 * in from the credentials the signup form left behind. Falls back to the login view when
 * those are gone, which is any entry point other than a signup in this same page view.
 * The panel rises in and the mark pops once, then a halo keeps radiating off it.
 */
export function AccountVerified() {
    const { t } = useTranslation();
    const { mutate: login, error, isPending } = useLogin();
    const { go, runOnSuccess, consumeCredentials } = useAuthModal();

    const onAccess = () => {
        const pending = consumeCredentials();

        if (pending === null) {
            go("login");
            return;
        }

        login(
            { credentials: pending.email, password: pending.password },
            { onSuccess: () => runOnSuccess(), onError: () => go("login") }
        );
    };

    return (
        <div className="flex animate-verified-in flex-col items-center gap-4 text-center">
            {error && <Alert error={error} />}

            <span className="relative flex size-20 animate-verified-mark items-center justify-center rounded-full bg-success/10 text-success">
                <span
                    aria-hidden
                    className="absolute inset-0 animate-verified-halo rounded-full bg-success/20"
                />
                <CircleCheckIcon className="relative size-12" />
            </span>

            <p className="text-balance text-muted-foreground text-sm">
                {t("auth.verified.message")}
            </p>

            <Button
                size="lg"
                type="button"
                className="w-full"
                loading={isPending}
                onClick={onAccess}
            >
                {t("auth.verified.access")}
            </Button>
        </div>
    );
}
