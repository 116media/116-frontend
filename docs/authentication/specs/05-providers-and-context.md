# Spec 05 — Providers & Context

The `me` query, the `AuthProvider` context + `useAuth()`, query keys, SSR
hydration, and cross-tab sync.

Design ref: [../05-state-management.md](../05-state-management.md).

---

## Tasks

- [ ] `authKeys` query-key factory
- [ ] `AuthProvider` + `useAuth` (me query, derived status, listeners)
- [ ] Mount provider tree in `app/layout.tsx`
- [ ] SSR prefetch + `HydrationBoundary` in `app/(public)/layout.tsx`
- [ ] Cross-tab `BroadcastChannel('auth')` sync
- [ ] Verify: reload stays authenticated; logout → guest in all tabs

---

## Query keys

```ts
// src/modules/auth/presentation/context/authKeys.ts

/**
 * Stable TanStack Query keys for the auth module. `me` is the single source of
 * truth for the current user.
 */
export const authKeys = {
    me: ["auth", "me"] as const,
    sessions: ["auth", "sessions"] as const,
    session: (id: string) => ["auth", "session", id] as const,
};
```

---

## AuthProvider & useAuth

```tsx
// src/modules/auth/presentation/context/AuthProvider.tsx
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo } from "react";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IAuthUserEntity } from "@/modules/auth/domain/entities/IAuthUserEntity";
import type { AuthStatus } from "@/modules/auth/domain/valueobjects/AuthStatus";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";
import container from "@/shared/infrastructure/service.locator";

/**
 * The value exposed by the auth context.
 *
 * @interface AuthContextValue
 * @property {IAuthUserEntity | null} user - The current user, or null when guest.
 * @property {AuthStatus} status - Derived status: loading | guest | unverified | authenticated.
 * @property {boolean} isAuthenticated - Convenience for `status === "authenticated"`.
 * @property {() => void} refetch - Re-runs the `me` query.
 */
export interface AuthContextValue {
    user: IAuthUserEntity | null;
    status: AuthStatus;
    isAuthenticated: boolean;
    refetch: () => void;
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
function deriveAuthStatus(isLoading: boolean, user: IAuthUserEntity | null): AuthStatus {
    if (isLoading) return "loading";
    if (!user) return "guest";
    if (!user.isVerified) return "unverified";
    return "authenticated";
}

/**
 * AuthProvider
 *
 * @description
 * Runs the `me` query (`GET /me/profile`, cookie-authenticated) and exposes the
 * resolved user + derived status to the whole app. Listens for
 * `REFRESH_TOKEN_EXPIRED_EVENT` (drop to guest) and a `BroadcastChannel('auth')` ping
 * (cross-tab invalidation). Must sit inside `QueryProvider`.
 *
 * @param children - The subtree that gains `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const meQuery = useQuery({
        queryKey: authKeys.me,
        queryFn: () => container.cradle.getOwnProfileUseCase.execute(),
        select: (result) => (result.ok ? result.value : null),
        staleTime: 5 * 60_000,
        retry: false,
    });

    const user = meQuery.data ?? null;
    const status = deriveAuthStatus(meQuery.isLoading, user);

    useEffect(() => {
        const onExpired = () => queryClient.removeQueries({ queryKey: authKeys.me });
        window.addEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);

        const channel = new BroadcastChannel("auth");
        channel.onmessage = () => queryClient.invalidateQueries({ queryKey: authKeys.me });

        return () => {
            window.removeEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);
            channel.close();
        };
    }, [queryClient]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            status,
            isAuthenticated: status === "authenticated",
            refetch: () => meQuery.refetch(),
        }),
        [user, status, meQuery],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth
 *
 * @description
 * Reads the app-wide auth state. Throws if used outside `AuthProvider`.
 *
 * @returns The current `{ user, status, isAuthenticated, refetch }`.
 */
export function useAuth(): AuthContextValue {
    const value = useContext(AuthContext);
    if (!value) throw new Error("useAuth must be used within an AuthProvider");
    return value;
}
```

---

## Provider tree

```tsx
// app/layout.tsx (excerpt)
<ThemeProvider>
    <QueryProvider>
        <I18nProvider>
            <AuthProvider>
                <AuthModalProvider>
                    {children}
                    <Toaster />
                </AuthModalProvider>
            </AuthProvider>
        </I18nProvider>
    </QueryProvider>
</ThemeProvider>
```

---

## SSR hydration

There is **no** `getCurrentUser` helper — the current user is resolved inline in
the existing `(public)` layout, the same way it already prefetches navigation:
one request-scoped `createServerCradle()`, the use cases run in parallel, and the
`me` query is seeded so the first client paint reflects real auth state (no flash
of guest UI). The layout below extends the app's real `PublicLayout`.

```tsx
// app/(public)/layout.tsx (server component)
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import { unwrap } from "@/shared/domain/results/result";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { Header } from "@/shared/presentation/layouts/Header";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group.
 * Prefetches navigation and the current user in parallel server-side via one
 * request-scoped cradle, then hydrates the `me` query so the first client paint
 * already reflects the real auth state — no flash of guest UI. TopBar and Header
 * are wrapped in a single sticky container so they scroll together.
 *
 * @param children - Page content rendered within the layout
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const cradle = await createServerCradle();

    const [contentResult, currentUserResult] = await Promise.all([
        cradle.prefetchNavigationUseCase.execute(),
        cradle.getOwnProfileUseCase.execute(),
    ]);

    const { articles, videos } = unwrap(contentResult, {
        videos: { categories: [], promotedVideos: [], popularTags: [] },
        articles: { categories: [], promotedArticles: [], popularTags: [] },
    });

    const queryClient = new QueryClient();
    queryClient.setQueryData(authKeys.me, currentUserResult);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="sticky top-0 z-40">
                <TopBar />
                <Header videos={videos} articles={articles} />
            </div>
            <main className="min-h-screen py-4">
                <PageContainer>{children}</PageContainer>
            </main>
        </HydrationBoundary>
    );
}
```

> Content gets `unwrap(contentResult, fallback)` because `<Header>` needs plain
> values. The `me` query **stores a `Result`** (its `queryFn` is
> `getOwnProfileUseCase.execute()`, and `select` does `result.ok ? result.value :
> null`), so `currentUserResult` is seeded **as-is** — the hydrated cache is
> exactly what the client `queryFn` would produce, and an error result (no session)
> selects to `null` → guest.

---

## Verification

- [ ] Logged-in **reload** renders authenticated with no guest flash (SSR hydrate).
- [ ] `useAuth().status` derives correctly for verified / unverified / guest.
- [ ] `REFRESH_TOKEN_EXPIRED_EVENT` → status becomes guest.
- [ ] Logging out in one tab updates the others (BroadcastChannel).
- [ ] tsc + biome clean.
