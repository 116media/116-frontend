import { Fragment, type ReactNode } from "react";

import { AppShell } from "@/shared/presentation/layouts/AppShell";

/**
 * PublicLayout
 *
 * @description
 * Root layout for all public-facing pages under the `(public)` route group. Renders the
 * universal {@link AppShell} chrome (sticky TopBar + Header with server-prefetched
 * navigation) around the page content, plus the `@modal` slot that intercepted routes
 * render into, so an overlay opens over the page it was launched from and a refresh still
 * lands on the real route. Open to guests; the `(private)` group renders the same shell
 * behind an auth guard.
 *
 * @param children - Page content rendered within the layout.
 * @param modal - The intercepted overlay for the current route, or nothing.
 */
export default function PublicLayout({
    children,
    modal
}: {
    children: ReactNode;
    modal: ReactNode;
}) {
    return (
        <Fragment>
            <AppShell>{children}</AppShell>
            {modal}
        </Fragment>
    );
}
