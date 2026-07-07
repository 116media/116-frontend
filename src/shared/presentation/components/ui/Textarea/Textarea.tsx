"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Textarea
 *
 * @description
 * The base multiline text primitive — the textarea sibling of `Input`. Mirrors `Input`'s
 * tokens exactly: transparent surface (`dark:bg-input/30` in dark), `border-input`
 * border, rounded corners, the shadcn focus ring (`ring-3 ring-ring/20` +
 * `border-ring`), and the disabled + `aria-invalid` states (light and dark). Adds a
 * comfortable auto min-height (`min-h-24`) and vertical-only resize. All theme tokens, so
 * light/dark is automatic; callers override sizing or radius via `className` (merged by
 * `cn`, so later utilities win).
 *
 * @param className - Extra classes merged onto (and overriding) the base styles.
 */
export const Textarea = forwardRef<
    HTMLTextAreaElement,
    TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
            "min-h-24 w-full min-w-0 resize-y rounded-md border border-input bg-transparent px-3 py-2",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "text-base outline-none transition-colors placeholder:text-muted-foreground md:text-sm",
            "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
            "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/20",
            className
        )}
        {...props}
    />
));
Textarea.displayName = "Textarea";
