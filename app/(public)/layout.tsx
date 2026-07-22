import type { ReactNode } from "react";

import { AppShell } from "@/shared/presentation/layouts/AppShell";

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group. Renders the
 * universal {@link AppShell} chrome (sticky TopBar + Header with server-prefetched
 * navigation) around the page content. Open to guests; the `(private)` group renders the
 * same shell behind an auth guard.
 *
 * @param children - Page content rendered within the layout.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    return <AppShell>{children}</AppShell>;
}
