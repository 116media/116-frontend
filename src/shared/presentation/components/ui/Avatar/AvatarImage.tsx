"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * AvatarImage
 *
 * @description
 * Plain image slot for the Avatar compound component.
 * Renders a standard img tag — suitable for external URLs where
 * Next.js Image optimisation is not required.
 *
 * For Next.js Image optimisation, render next/image directly inside
 * the Avatar root component alongside AvatarFallback instead:
 *
 * ```tsx
 * <Avatar>
 *     <Image src={url} alt="..." fill className="object-cover" sizes="..." />
 *     <AvatarFallback>...</AvatarFallback>
 * </Avatar>
 * ```
 */
export const AvatarImage = forwardRef<
    ComponentRef<typeof AvatarPrimitive.Image>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
