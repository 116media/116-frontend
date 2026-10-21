"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { XIcon } from "@/shared/presentation/components/ui/Icon";
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
 * The shared dismiss control for any dialog surface: a plain cross on a round ghost
 * button that carries a faint fill at rest, so the target reads against any panel.
 * Placement is the caller's, so a centred modal can pin it to the corner while a
 * full-screen sheet sits it inline in its header.
 */
export function DialogCloseButton({ label, className }: DialogCloseButtonProps) {
    return (
        <DialogPrimitive.Close
            aria-label={label}
            className={cn(
                "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
                "bg-foreground/5 text-muted-foreground transition-colors",
                "hover:bg-foreground/10 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
        >
            <XIcon className="size-5" />
        </DialogPrimitive.Close>
    );
}
