"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

/**
 * Avatar
 *
 * @description
 * Root container for the Avatar compound component.
 * Renders a fixed-size circular container with overflow hidden so that
 * child images and fallback content are clipped to the circle shape.
 * Built on Radix UI Avatar primitive for accessible load-state management.
 *
 * Compose with next/image directly inside this root (alongside AvatarFallback)
 * to take advantage of Next.js image optimization.
 */
export const Avatar = forwardRef<ComponentRef<typeof AvatarPrimitive.Root>, AvatarProps>(
    ({ className, ...props }, ref) => (
        <AvatarPrimitive.Root
            ref={ref}
            className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
            {...props}
        />
    )
);
Avatar.displayName = AvatarPrimitive.Root.displayName;
