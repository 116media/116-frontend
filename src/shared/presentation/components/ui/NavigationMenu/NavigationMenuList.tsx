"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuList
 *
 * @description
 * Ordered list of NavigationMenuItems laid out horizontally.
 * Gap between items matches the spacing used in the plain-link
 * nav so switching to this primitive keeps visual parity.
 */
export const NavigationMenuList = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.List>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
