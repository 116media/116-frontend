import type { ReactNode } from "react";
import { SettingsSidebar } from "@/modules/settings/presentation/components/navigation/SettingsSidebar";

/**
 * SettingsLayout
 *
 * @description
 * Renders the settings shell — the tab sidebar beside the active tab's content. Auth is
 * handled once by the parent `(private)` group layout (client `AuthGuard` + the
 * server-side `proxy` cookie gate), so this layout only owns presentation.
 *
 * @param children - The active settings tab.
 */
export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full pb-8">
            <div className="flex flex-col lg:min-h-[calc(100vh-140px)] lg:flex-row lg:rounded-lg lg:border lg:bg-background">
                <SettingsSidebar />
                <div className="min-w-0 flex-1 py-4 lg:rounded-r-lg lg:border-l lg:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
