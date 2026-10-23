"use client";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SheetRegionProps } from "./types";

/**
 * Sheet.Footer
 *
 * @description
 * The sheet's fixed bottom region, for the action a sheet exists to perform — a composer,
 * a submit row, a sign-in prompt. Padded for the home indicator so the last control is not
 * under the gesture bar.
 *
 * @param children - The footer's content.
 * @param className - Extra classes merged onto the region.
 */
export function SheetFooter({ children, className }: SheetRegionProps) {
    return (
        <footer
            className={cn(
                "shrink-0 border-outlined border-t bg-dialog p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6",
                className
            )}
        >
            {children}
        </footer>
    );
}
