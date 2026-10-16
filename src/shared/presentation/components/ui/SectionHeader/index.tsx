import type { ReactNode } from "react";

/**
 * Props for the SectionHeader component.
 *
 * @interface SectionHeaderProps
 * @property {ReactNode} icon - The leading icon, rendered in a boxed muted square.
 * @property {string} title - The section title.
 * @property {string} [subtitle] - Optional supporting line under the title.
 * @property {"h1" | "h2"} [as] - Heading level for the title. Defaults to `h2`; a page-level
 * header (e.g. a settings tab) passes `h1`.
 */
export interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    as?: "h1" | "h2";
}

/**
 * SectionHeader
 *
 * @description
 * A shared header row for a page or section: a boxed leading icon followed by the title
 * and an optional subtitle, on the same panel treatment as the content it heads. Carries no
 * outer spacing: the surface that renders it sets the gap, so a margin here and a parent's
 * `gap` can never double up. Used by the settings tabs (as `h1`) and the detail sidebars.
 */
export function SectionHeader({ icon, title, subtitle, as = "h2" }: SectionHeaderProps) {
    const Heading = as;
    return (
        <div className="flex items-center gap-4 rounded-lg bg-muted/40 p-3 sm:p-4">
            <div className="flex size-16 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-5">
                {icon}
            </div>
            <div>
                <Heading className="font-semibold text-foreground text-lg">{title}</Heading>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>
        </div>
    );
}
