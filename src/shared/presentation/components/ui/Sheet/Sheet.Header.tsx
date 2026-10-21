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
    closeLabel = "Close",
    showCloseButton = true
}: SheetHeaderProps) {
    return (
        <header
            className={cn(
                "flex shrink-0 flex-col gap-3 p-4 sm:px-6 border-b border-outlined",
                className
            )}
        >
            <div className="relative flex min-w-0 flex-col items-center gap-1 px-7 text-center">
                {leading && <span className="absolute top-0 left-0">{leading}</span>}
                <DialogTitle className="font-semibold text-foreground text-2xl">
                    {title}
                </DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
                {showCloseButton && (
                    <DialogCloseButton
                        label={closeLabel}
                        className="-top-1 absolute right-0"
                    />
                )}
            </div>
            {children}
        </header>
    );
}
