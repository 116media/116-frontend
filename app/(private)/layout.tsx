import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AuthGuard } from "@/modules/auth/presentation/containers/AuthGuard";
import { HOME_PATH } from "@/shared/presentation/constants/paths";
import { AppShell } from "@/shared/presentation/layouts/AppShell";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

/**
 * PrivateLayout
 *
 * @description
 * Server session boundary for every route placed in the `(private)` group.
 * The client guard resolves and refreshes recoverable sessions.
 *
 * @param children - The active private route.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const hasAccessToken = cookieStore.has(ACCESS_TOKEN_COOKIE);
    const hasRefreshToken = cookieStore.has(REFRESH_TOKEN_COOKIE);

    if (!hasAccessToken && !hasRefreshToken) redirect(HOME_PATH);

    return (
        <AppShell>
            <AuthGuard>{children}</AuthGuard>
        </AppShell>
    );
}
