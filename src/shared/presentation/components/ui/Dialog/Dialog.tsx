"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XCircle } from "lucide-react";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    type HTMLAttributes
} from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Dialog root — controls open state.
 */
export const Dialog = DialogPrimitive.Root;

/**
 * Element that opens the dialog when activated.
 */
export const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Renders the dialog into a portal at the document root.
 */
export const DialogPortal = DialogPrimitive.Portal;

/**
 * Element that closes the dialog when activated.
 */
export const DialogClose = DialogPrimitive.Close;

/**
 * DialogOverlay
 *
 * @description
 * The dimmed, blurred backdrop behind the dialog. Animates with the open state.
 */
export const DialogOverlay = forwardRef<
    ComponentRef<typeof DialogPrimitive.Overlay>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent
 *
 * @description
 * The centered dialog panel on a `bg-card` surface with `rounded-2xl` corners and a
 * circular close affordance (top-right). Renders inside an overlay + portal.
 *
 * @param className - Extra classes merged onto the panel.
 * @param children - The dialog body.
 */
export const DialogContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Content>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-xl duration-200 focus:outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                className="absolute right-4 top-4 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
            >
                <XCircle className="size-5" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader
 *
 * @description
 * Wraps the title + description; centered, matching the kinix auth modal.
 *
 * @param className - Extra classes merged onto the header.
 */
export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col gap-1.5 text-center", className)}
            {...props}
        />
    );
}

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
