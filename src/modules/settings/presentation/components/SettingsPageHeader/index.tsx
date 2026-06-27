import type { ReactNode } from "react";

/**
 * Props for the SettingsPageHeader component.
 *
 * @interface SettingsPageHeaderProps
 * @property {ReactNode} icon - The leading icon for the tab.
 * @property {string} title - The tab title.
 * @property {string} [subtitle] - Optional supporting line under the title.
 */
export interface SettingsPageHeaderProps {
    icon: ReactNode;
    title: string;
    subtitle?: string;
}

/**
 * SettingsPageHeader
 *
 * @description
 * The header row atop each settings tab: a boxed leading icon followed by the tab
 * title and an optional subtitle. Mirrors the dashboard's settings page header.
 *
 * @param icon - The leading icon element.
 * @param title - The tab title.
 * @param subtitle - Optional supporting line under the title.
 */
export function SettingsPageHeader({ icon, title, subtitle }: SettingsPageHeaderProps) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-5">
                {icon}
            </div>
            <div>
                <h1 className="font-semibold text-foreground text-lg">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>
        </div>
    );
}
