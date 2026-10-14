"use client";

import {
    DialogCloseButton,
    DialogDescription,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SheetHeaderProps } from "./types";

/**
 * Sheet.Header
 *
 * @description
 * The sheet's fixed top region: title and close control on one row, an optional
 * supporting line, and a slot below for a filter row such as the shared tabs. Supplies
 * the dialog's accessible name, so every sheet gets one from the title it already shows.
 *
 * @param title - The sheet's title.
 * @param leading - Control before the title, e.g. a back button.
 * @param align - How the title block aligns.
 * @param description - Supporting line under the title.
 * @param children - Row under the title, e.g. tabs.
 * @param showCloseButton - Whether to render the close control.
 * @param closeLabel - Accessible label for the close control.
 * @param className - Extra classes merged onto the header.
 */
export function SheetHeader({
    title,
    leading,
    children,
    className,
    description,
    align = "start",
    closeLabel = "Close",
    showCloseButton = true
}: SheetHeaderProps) {
    return (
        <header
            className={cn(
                "flex shrink-0 flex-col gap-3 p-3 sm:px-6 border-b border-outlined",
                className
            )}
        >
            <div className="flex items-start justify-between gap-2">
                {leading}
                <div
                    className={cn(
                        "flex min-w-0 flex-1 flex-col gap-1",
                        align === "center" && "items-center text-center"
                    )}
                >
                    <DialogTitle className="font-semibold text-foreground text-2xl">
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </div>
                {showCloseButton && (
                    <DialogCloseButton
                        label={closeLabel}
                        className="mt-1 shrink-0"
                    />
                )}
            </div>
            {children}
        </header>
    );
}
