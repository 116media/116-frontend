import type { ReactNode } from "react";

import { FavoriteLayoutSidebar } from "./FavoriteLayout.Sidebar";

export interface FavoriteLayoutProps {
    children: ReactNode;
}

/**
 * Shared frame for the private favorites routes.
 */
export function FavoriteLayout({ children }: FavoriteLayoutProps) {
    return (
        <div className="mx-auto w-full pb-8">
            <div className="flex min-h-[calc(100vh-140px)] flex-col rounded-lg border bg-background md:flex-row">
                <FavoriteLayoutSidebar />
                <div className="min-w-0 flex-1 rounded-b-lg bg-background p-4 md:rounded-b-none md:rounded-r-lg md:border-l">
                    {children}
                </div>
            </div>
        </div>
    );
}
