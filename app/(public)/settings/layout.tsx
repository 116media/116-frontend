import type { ReactNode } from "react";

import { SettingsGuard } from "@/modules/settings/presentation/components/SettingsGuard";
import { SettingsSidebar } from "@/modules/settings/presentation/components/SettingsSidebar";

/**
 * SettingsLayout
 *
 * @description
 * Renders the settings shell — the tab sidebar beside the active tab's content, within
 * the public app chrome (header/topbar) provided by the parent layout. Access is gated
 * by the client-side {@link SettingsGuard}, which reads the browser auth state (with
 * transparent token refresh) so the check is reliable across client navigations, unlike
 * a server-rendered profile fetch that can be stale.
 *
 * @param children - The active settings tab.
 */
export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full pb-8">
            <div className="flex min-h-[calc(100vh-140px)] flex-col overflow-hidden rounded-lg border bg-background md:flex-row">
                <SettingsSidebar />
                <div className="min-w-0 flex-1 bg-background p-4">
                    <SettingsGuard>{children}</SettingsGuard>
                </div>
            </div>
        </div>
    );
}
