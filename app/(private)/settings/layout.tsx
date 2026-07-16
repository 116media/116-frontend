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
            <div className="flex min-h-[calc(100vh-140px)] flex-col rounded-lg border bg-background md:flex-row">
                <SettingsSidebar />
                <div className="min-w-0 flex-1 rounded-b-lg bg-background p-4 md:rounded-b-none md:rounded-r-lg md:border-l">
                    {children}
                </div>
            </div>
        </div>
    );
}
