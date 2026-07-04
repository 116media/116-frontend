"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * DropdownMenuLabel
 *
 * @description
 * A non-interactive caption inside the dropdown menu, used to title a group of
 * items. Supports an optional inset to align with icon-bearing items.
 *
 * @param inset - Adds left padding to align text with icon-bearing items.
 */
export const DropdownMenuLabel = forwardRef<
    ComponentRef<typeof DropdownMenuPrimitive.Label>,
    ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-xs font-medium text-muted-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
