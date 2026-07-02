"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * DialogTitle
 *
 * @description
 * The dialog's accessible title.
 */
export const DialogTitle = forwardRef<
    ComponentRef<typeof DialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
