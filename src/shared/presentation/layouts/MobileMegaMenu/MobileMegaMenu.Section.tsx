import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { MobileMegaMenuSectionProps } from "./types";

/**
 * MobileMegaMenu.Section
 *
 * @description
 * One labelled block inside a tab panel: an uppercase heading above its content,
 * matching the mega menu's column headings.
 */
export function MobileMegaMenuSection({ title, children, className }: MobileMegaMenuSectionProps) {
    return (
        <section className={cn("flex flex-col gap-3 p-3", className)}>
            <h3 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                {title}
            </h3>
            {children}
        </section>
    );
}
