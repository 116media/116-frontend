"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo } from "react";
import {
    type AuthStatus,
    isAuthenticatedStatus
} from "@/modules/auth/domain/valueobjects/AuthStatus";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import { getAuthChannel } from "@/modules/auth/presentation/utils/authChannel";
import { deriveAuthStatus } from "@/modules/auth/presentation/utils/status/status.utils";
import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";
import { type Failure, unknownFailure } from "@/shared/domain/failures/failure";
import { err } from "@/shared/domain/results/result";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";
import container from "@/shared/infrastructure/service.locator";

/**
 * Identifies profile failures that definitively invalidate the browser session.
 *
 * @param failure - The profile request failure.
 * @returns Whether the user must be treated as signed out.
 */
function isSessionFailure(failure: Failure): boolean {
    return "status" in failure && (failure.status === 401 || failure.status === 403);
}

/**
 * The value exposed by the auth context.
 *
 * @interface AuthContextValue
 * @property {IAuthUserEntity | null} user - The current user, or null when guest.
 * @property {AuthStatus} status - Derived status: loading | guest | unverified | authenticated.
 * @property {boolean} isAuthenticated - Convenience for `status === "authenticated"`.
 * @property {() => Promise<unknown>} refetch - Re-runs the `me` query; resolves when it settles.
 */
export interface AuthContextValue {
    user: IAuthUserEntity | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    refetch: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider
 *
 * @description
 * Runs the `me` query and exposes the resolved user plus derived status to the
 * app. Listens for `REFRESH_TOKEN_EXPIRED_EVENT` and cross-tab auth channel
 * pings. Must sit inside `QueryProvider`.
 *
 * @param children - The subtree that gains `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const meQuery = useQuery({
        queryKey: authKeys.me,
        queryFn: async () => {
            const result = await container.cradle.getProfileUseCase.execute();
            if (!result.ok && !isSessionFailure(result.error)) throw result.error;
            return result;
        },
        select: (result) => (result.ok ? result.value : null),
        staleTime: 5 * 60_000,
        retry: 1,
        refetchOnMount: "always",
        refetchOnReconnect: "always",
        refetchOnWindowFocus: "always"
    });

    const user = meQuery.data ?? null;
    const status = deriveAuthStatus(meQuery.isPending, meQuery.isError, user);

    useEffect(() => {
        const onExpired = () => queryClient.setQueryData(authKeys.me, err(unknownFailure()));
        window.addEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);

        const channel = getAuthChannel();
        const onMessage = () => queryClient.invalidateQueries({ queryKey: authKeys.me });
        channel?.addEventListener("message", onMessage);

        return () => {
            window.removeEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);
            channel?.removeEventListener("message", onMessage);
        };
    }, [queryClient]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            status,
            isAuthenticated: isAuthenticatedStatus(status),
            refetch: () => meQuery.refetch()
        }),
        [user, status, meQuery.refetch]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth
 *
 * @description
 * Reads the current user + derived status from anywhere in the app. Throws outside
 * the provider.
 *
 * @returns The `AuthContextValue`.
 */
export function useAuth(): AuthContextValue {
    const value = useContext(AuthContext);
    if (!value) throw new Error("useAuth must be used within an AuthProvider");
    return value;
}
