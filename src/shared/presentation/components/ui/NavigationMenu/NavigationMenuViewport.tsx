"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * NavigationMenuViewport
 *
 * @description
 * The container that renders the active NavigationMenuContent panel.
 * The outer wrapper spans the full viewport width and is anchored to
 * the left edge of the page so the mega menu panel appears edge-to-edge.
 * The primitive handles open/close sizing and slide transitions.
 */
export const NavigationMenuViewport = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
    <div className="fixed left-0 top-[calc(var(--header-height,4rem))] w-full overflow-hidden">
        <NavigationMenuPrimitive.Viewport
            ref={ref}
            className={cn(
                "relative w-full overflow-hidden",
                "border-b border-border bg-mega-menu text-popover-foreground shadow-lg",
                "data-[state=open]:animate-mega-menu-slide-down data-[state=closed]:animate-mega-menu-slide-up",
                className
            )}
            {...props}
        />
    </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
