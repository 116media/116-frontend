"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

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
    const [recovering, setRecovering] = useState(status === "guest");

    useEffect(() => {
        if (status !== "guest") {
            setRecovering(false);
            return;
        }

        let active = true;
        setRecovering(true);
        refetch().finally(() => {
            if (active) setRecovering(false);
        });

        return () => {
            active = false;
        };
    }, [status, refetch]);

    useEffect(() => {
        if (status === "guest" && !recovering) router.replace(HOME_PATH);
    }, [status, recovering, router]);

    if (status === "authenticated" || status === "unverified") return <>{children}</>;

    return (
        <div className="flex min-h-64 items-center justify-center">
            <SpinnerIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
}
