"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

import { DialogOverlay } from "./DialogOverlay";

/**
 * DialogContent
 *
 * @description
 * The dialog's content region, rendered over a dimmed overlay + portal and centered
 * with the `translate` property (`-translate-x-1/2 -translate-y-1/2`). Centering uses
 * the `translate` property while the enter/exit animation uses `transform`, so the
 * two never collide: the panel rises from below on open and drops back down on close
 * (Radix keeps it mounted for the exit via its own Presence). This is a generic
 * surface — the panel's own chrome (background, border, padding, close button) is
 * supplied by `children`, so nothing app-specific leaks into the primitive.
 *
 * @param className - Extra classes merged onto the content region.
 * @param children - The panel content.
 */
export const DialogContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Content>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 focus:outline-none",
                "data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out",
                className
            )}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
