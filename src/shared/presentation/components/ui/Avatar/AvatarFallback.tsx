"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * AvatarFallback
 *
 * @description
 * Fallback slot rendered by Radix when the image has not loaded or is absent.
 * Accepts any React children — typically initials text or an icon.
 * Only renders after a short delay so it does not flash during fast image loads.
 */
export const AvatarFallback = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Fallback>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
