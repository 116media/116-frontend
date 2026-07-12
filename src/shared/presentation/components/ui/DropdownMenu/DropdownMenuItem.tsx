"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * DropdownMenuItem
 *
 * @description
 * A single selectable item inside the dropdown menu.
 * Highlights on focus/hover using accent tokens.
 * Supports an optional inset to align with items that have icons.
 *
 * @param inset - Adds left padding to align text with icon-bearing items
 */
export const DropdownMenuItem = forwardRef<
    ComponentRef<typeof DropdownMenuPrimitive.Item>,
    ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
            "focus:bg-accent focus:text-accent-foreground",
            "data-disabled:pointer-events-none data-disabled:opacity-50",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
