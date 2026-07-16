import type { ReactNode } from "react";

import { FavoritesSidebar } from "@/modules/favorites/presentation/components/navigation/FavoritesSidebar";

/**
 * FavoritesLayout
 *
 * @description
 * Renders the favorites shell — the content-type sidebar beside the active route's content.
 * Auth is handled once by the parent `(private)` group layout (client `AuthGuard` + the
 * server-side `proxy` cookie gate), so this layout only owns presentation.
 *
 * @param children - The active favorites route.
 */
export default function FavoritesLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full pb-8">
            <div className="flex min-h-[calc(100vh-140px)] flex-col rounded-lg border bg-background md:flex-row">
                <FavoritesSidebar />
                <div className="min-w-0 flex-1 rounded-b-lg bg-background p-4 md:rounded-b-none md:rounded-r-lg md:border-l">
                    {children}
                </div>
            </div>
        </div>
    );
}
