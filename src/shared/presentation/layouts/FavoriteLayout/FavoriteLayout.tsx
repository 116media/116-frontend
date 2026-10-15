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
            <div className="flex flex-col lg:min-h-[calc(100vh-140px)] lg:flex-row lg:rounded-lg lg:border lg:bg-background">
                <FavoriteLayoutSidebar />
                <div className="min-w-0 flex-1 py-4 lg:rounded-r-lg lg:border-l lg:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
