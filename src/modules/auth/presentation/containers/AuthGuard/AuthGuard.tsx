"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    isAuthenticatedStatus,
    needsVerification
} from "@/modules/auth/domain/valueobjects/AuthStatus";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { FeedError } from "@/shared/presentation/components/ui/FeedError";
import { SpinnerIcon } from "@/shared/presentation/components/ui/Icon";
import { HOME_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for AuthGuard.
 *
 * @interface AuthGuardProps
 * @property {ReactNode} children - The protected content of a private route.
 */
export interface AuthGuardProps {
    children: ReactNode;
}

/**
 * AuthGuard
 *
 * @description
 * Client-side auth guard for the private route group, driven by `useAuth()`. An apparent
 * guest is re-checked once (recovering an expired access token via a refresh) before a
 * redirect home; a spinner shows while the auth state resolves. Pairs with the server-side
 * `proxy` cookie gate so every private route is protected on both sides.
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { status, refetch } = useAuth();
    const { t } = useTranslation();
    const [rechecked, setRechecked] = useState(false);

    useEffect(() => {
        if (status !== "guest") {
            setRechecked(false);
            return;
        }

        let active = true;
        refetch().finally(() => {
            if (active) setRechecked(true);
        });

        return () => {
            active = false;
        };
    }, [status, refetch]);

    useEffect(() => {
        if (status === "guest" && rechecked) router.replace(HOME_PATH);
    }, [status, rechecked, router]);

    if (isAuthenticatedStatus(status) || needsVerification(status)) return <>{children}</>;

    if (status === "error") {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <FeedError
                    context="auth-guard-error"
                    title={t("auth.errors.sessionUnavailable")}
                    retryLabel={t("auth.errors.retry")}
                    onRetry={() => void refetch()}
                />
            </div>
        );
    }

    return (
        <div className="flex min-h-64 items-center justify-center">
            <SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
}
