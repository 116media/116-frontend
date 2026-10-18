import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * How much room the header takes. `md` heads a page or a detail sidebar; `sm` heads a
 * group inside a dense surface such as the search panel, where the page-sized box
 * crowds out the results it is labelling.
 */
export type SectionHeaderSize = "sm" | "md";

/**
 * Per-size geometry: the box, the icon well, the icon itself and the two text rows.
 */
const SIZES: Record<
    SectionHeaderSize,
    { box: string; well: string; title: string; subtitle: string }
> = {
    md: {
        box: "gap-4 p-3 sm:p-4",
        well: "size-16 [&_svg]:size-5",
        title: "text-lg",
        subtitle: "text-sm"
    },
    sm: {
        box: "gap-3 p-2",
        well: "size-9 [&_svg]:size-4",
        title: "text-sm",
        subtitle: "text-xs"
    }
};

/**
 * Props for the SectionHeader component.
 *
 * @interface SectionHeaderProps
 * @property {ReactNode} icon - The leading icon, rendered in a boxed muted square.
 * @property {string} title - The section title.
 * @property {string} [subtitle] - Optional supporting line under the title.
 * @property {"h1" | "h2"} [as] - Heading level for the title. Defaults to `h2`; a page-level
 * header (e.g. a settings tab) passes `h1`.
 * @property {SectionHeaderSize} [size] - How much room it takes. Defaults to `md`.
 */
export interface SectionHeaderProps {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    as?: "h1" | "h2";
    size?: SectionHeaderSize;
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
export function SectionHeader({
    icon,
    title,
    subtitle,
    as = "h2",
    size = "md"
}: SectionHeaderProps) {
    const Heading = as;
    const scale = SIZES[size];

    return (
        <div className={cn("flex items-center rounded-lg bg-muted/40", scale.box)}>
            <div
                className={cn(
                    "flex shrink-0 items-center justify-center rounded-md bg-muted text-foreground",
                    scale.well
                )}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <Heading className={cn("font-semibold text-foreground", scale.title)}>
                    {title}
                </Heading>
                {subtitle && (
                    <p className={cn("text-muted-foreground", scale.subtitle)}>{subtitle}</p>
                )}
            </div>
        </div>
    );
}
