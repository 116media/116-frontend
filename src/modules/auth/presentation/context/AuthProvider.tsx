"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo } from "react";
import type { IAuthUser } from "@/modules/auth/domain/entities/IAuthUser";
import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import { getAuthChannel } from "@/modules/auth/presentation/utils/authChannel";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";
import container from "@/shared/infrastructure/service.locator";

/**
 * The value exposed by the auth context.
 *
 * @interface AuthContextValue
 * @property {IAuthUser | null} user - The current user, or null when guest.
 * @property {AuthStatus} status - Derived status: loading | guest | unverified | authenticated.
 * @property {boolean} isAuthenticated - Convenience for `status === "authenticated"`.
 * @property {() => Promise<unknown>} refetch - Re-runs the `me` query; resolves when it settles.
 */
export interface AuthContextValue {
    user: IAuthUser | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    refetch: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * deriveAuthStatus
 *
 * @description
 * Maps the `me`-query state to the derived auth status using guard clauses (no
 * nested ternaries): still loading, then no user (guest), then unverified email,
 * otherwise fully authenticated.
 *
 * @param isLoading - Whether the `me` query is still resolving.
 * @param user - The resolved user, or null when there is no session.
 * @returns The derived auth status.
 */
function deriveAuthStatus(isLoading: boolean, user: IAuthUser | null): AuthStatus {
    if (isLoading) return "loading";
    if (!user) return "guest";
    if (!user.isVerified) return "unverified";
    return "authenticated";
}

/**
 * AuthProvider
 *
 * @description
 * Runs the `me` query (cookie-authenticated profile) and exposes the resolved user
 * plus derived status to the whole app. Listens for `REFRESH_TOKEN_EXPIRED_EVENT`
 * (drop to guest) and a `BroadcastChannel('auth')` ping (cross-tab invalidation).
 * Must sit inside `QueryProvider`.
 *
 * @param children - The subtree that gains `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const meQuery = useQuery({
        queryKey: authKeys.me,
        queryFn: () => container.cradle.getProfileUseCase.execute(),
        select: (result) => (result.ok ? result.value : null),
        staleTime: 5 * 60_000,
        retry: false
    });

    const user = meQuery.data ?? null;
    const status = deriveAuthStatus(meQuery.isLoading, user);

    useEffect(() => {
        const onExpired = () => queryClient.removeQueries({ queryKey: authKeys.me });
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
            isAuthenticated: status === "authenticated",
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
