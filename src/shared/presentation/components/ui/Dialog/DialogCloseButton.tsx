"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { XCircleIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for DialogCloseButton.
 *
 * @interface DialogCloseButtonProps
 * @property {string} label - Accessible label for the control.
 * @property {string} [className] - Positioning and spacing, supplied by the caller.
 */
export interface DialogCloseButtonProps {
    label: string;
    className?: string;
}

/**
 * DialogCloseButton
 *
 * @description
 * The shared dismiss control for any dialog surface: a circled cross that lifts from
 * muted to foreground on hover. Placement is the caller's, so a centred modal can pin
 * it to the corner while a full-screen sheet sits it inline in its header.
 */
export function DialogCloseButton({ label, className }: DialogCloseButtonProps) {
    return (
        <DialogPrimitive.Close
            aria-label={label}
            className={cn(
                "cursor-pointer rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
        >
            <XCircleIcon className="size-5" />
        </DialogPrimitive.Close>
    );
}
