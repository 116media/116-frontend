import type { ReactNode } from "react";

import { FavoriteLayout as FavoriteLayoutFrame } from "@/shared/presentation/layouts/FavoriteLayout";

/**
 * FavoriteLayout
 *
 * @description
 * Renders the favorites shell — the content-type sidebar beside the active route's content.
 * Auth is handled once by the parent `(private)` group layout (client `AuthGuard` + the
 * server-side `proxy` cookie gate), so this layout only owns presentation.
 *
 * @param children - The active favorites route.
 */
export default function FavoriteLayout({ children }: { children: ReactNode }) {
    return <FavoriteLayoutFrame>{children}</FavoriteLayoutFrame>;
}
