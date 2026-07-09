"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { ChevronDownIcon } from "@/shared/presentation/components/ui/Icon";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * NavigationMenuTrigger
 *
 * @description
 * Button that opens the associated NavigationMenuContent panel on hover.
 * Styled to match the plain nav link appearance so it is visually
 * indistinguishable from non-mega-menu items at rest.
 */
export const NavigationMenuTrigger = forwardRef<
    ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            "outline-none",
            className
        )}
        {...props}
    >
        {children}
        <ChevronDownIcon
            size={14}
            className="text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
