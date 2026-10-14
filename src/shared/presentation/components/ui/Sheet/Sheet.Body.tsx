"use client";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SheetRegionProps } from "./types";

/**
 * Sheet.Body
 *
 * @description
 * The sheet's only scrolling region. `overscroll-contain` keeps a flick at either end
 * inside the sheet instead of handing it to the page behind.
 *
 * @param children - The scrolling content.
 * @param className - Extra classes merged onto the region.
 */
export function SheetBody({ children, className }: SheetRegionProps) {
    return (
        <div
            className={cn(
                "min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 pb-4 sm:px-6",
                className
            )}
        >
            {children}
        </div>
    );
}
