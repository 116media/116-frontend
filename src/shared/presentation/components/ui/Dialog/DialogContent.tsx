"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { XCircleIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { DialogOverlay } from "./DialogOverlay";

/**
 * Props for DialogContent.
 *
 * @interface DialogContentProps
 * @augments ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
 * @property {boolean} [showCloseButton] - Renders the top-right close control. Defaults to true;
 * set false when the dialog supplies its own close.
 * @property {string} [closeLabel] - Accessible label for the close control.
 */
export interface DialogContentProps
    extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    closeLabel?: string;
    showCloseButton?: boolean;
    closeClassName?: string;
}

/**
 * DialogContent
 *
 * @description
 * The dialog's content region, rendered over a dimmed overlay in a portal and
 * centered via the `translate` property so it never collides with the
 * `transform`-based enter/exit animation. Includes a consistent top-right close
 * control by default (opt out with `showCloseButton={false}`). The panel chrome is
 * supplied by `children`.
 *
 * @param className - Extra classes merged onto the content region.
 * @param children - The panel content.
 * @param showCloseButton - Whether to render the default close control.
 * @param closeLabel - Accessible label for the default close control.
 */
export const DialogContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(
    (
        {
            className,
            children,
            showCloseButton = true,
            closeLabel = "Close",
            closeClassName,
            ...props
        },
        ref
    ) => (
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
                {showCloseButton && (
                    <DialogPrimitive.Close
                        aria-label={closeLabel}
                        className={cn(
                            "absolute top-4 right-4 z-10 cursor-pointer rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            closeClassName
                        )}
                    >
                        <XCircleIcon className="size-5" />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;
