"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { DialogOverlay } from "./DialogOverlay";

/**
 * DialogContent
 *
 * @description
 * The dialog's content region, rendered over a dimmed overlay in a portal and
 * centered via the `translate` property so it never collides with the
 * `transform`-based enter/exit animation. The panel chrome is supplied by `children`.
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
