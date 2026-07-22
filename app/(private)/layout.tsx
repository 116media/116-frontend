import type { ReactNode } from "react";

import { AuthGuard } from "@/modules/auth/presentation/containers/AuthGuard";
import { AppShell } from "@/shared/presentation/layouts/AppShell";

/**
 * PrivateLayout
 *
 * @description
 * Root layout for the authenticated `(private)` route group. Renders the universal
 * {@link AppShell} chrome shared with public routes, then gates the content with the
 * client-side {@link AuthGuard}. The server-side `proxy` cookie check gates the same
 * paths before they render, so private routes are protected on both sides.
 *
 * @param children - The active private route.
 */
export default function PrivateLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell>
            <AuthGuard>{children}</AuthGuard>
        </AppShell>
    );
}
