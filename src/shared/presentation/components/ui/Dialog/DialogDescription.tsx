"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * DialogDescription
 *
 * @description
 * The dialog's accessible supporting text under the title.
 */
export const DialogDescription = forwardRef<
    ComponentRef<typeof DialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
