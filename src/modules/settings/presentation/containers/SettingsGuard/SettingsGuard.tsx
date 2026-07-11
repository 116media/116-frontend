"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import {
    isAuthenticatedStatus,
    needsVerification
} from "@/modules/auth/domain/valueobjects/AuthStatus";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { SpinnerIcon } from "@/shared/presentation/components/ui/Icon";
import { HOME_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for the SettingsGuard component.
 *
 * @interface SettingsGuardProps
 * @property {ReactNode} children - The protected settings content.
 */
export interface SettingsGuardProps {
    children: ReactNode;
}

/**
 * SettingsGuard
 *
 * @description
 * Client-side auth guard for the settings area, driven by `useAuth()`. An apparent
 * guest is re-checked once (recovering an expired access token via a refresh) before
 * a redirect home; a spinner shows while the auth state resolves.
 */
export function SettingsGuard({ children }: SettingsGuardProps) {
    const router = useRouter();
    const { status, refetch } = useAuth();
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

    // Redirect only once the recheck has settled and the visitor is still a guest.
    useEffect(() => {
        if (status === "guest" && rechecked) router.replace(HOME_PATH);
    }, [status, rechecked, router]);

    if (isAuthenticatedStatus(status) || needsVerification(status)) return <>{children}</>;

    return (
        <div className="flex min-h-64 items-center justify-center">
            <SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
}
