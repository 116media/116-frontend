"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the Avatar component.
 *
 * @interface AvatarProps
 * @augments ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
 */
export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

/**
 * Avatar
 *
 * @description
 * Root container for the Avatar compound component: a circular clipping container
 * built on the Radix Avatar primitive. Compose with next/image directly inside
 * (alongside AvatarFallback) for Next.js image optimization.
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
