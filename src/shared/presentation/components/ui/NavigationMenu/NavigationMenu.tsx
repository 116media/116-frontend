"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * NavigationMenu
 *
 * @description
 * Root container for the navigation menu. Manages open/close state
 * and positions the viewport relative to the trigger items.
 */
export const NavigationMenu = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Root>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn("relative flex items-center", className)}
        {...props}
    >
        {children}
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
