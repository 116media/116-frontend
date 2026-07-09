"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * NavigationMenuContent
 *
 * @description
 * The panel that appears when a NavigationMenuTrigger is activated.
 * Rendered inside the NavigationMenuViewport; uses popover tokens for
 * background, border, and text color — consistent with DropdownMenuContent.
 */
export const NavigationMenuContent = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Content>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
            "data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in-0 data-[motion=from-start]:slide-in-from-left-4",
            "data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in-0 data-[motion=from-end]:slide-in-from-right-4",
            "data-[motion=to-start]:animate-out data-[motion=to-start]:fade-out-0 data-[motion=to-start]:slide-out-to-left-4",
            "data-[motion=to-end]:animate-out data-[motion=to-end]:fade-out-0 data-[motion=to-end]:slide-out-to-right-4",
            className
        )}
        {...props}
    />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
