"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Textarea
 *
 * @description
 * The base multiline text primitive — the textarea sibling of `Input`, mirroring its
 * tokens, focus ring, and disabled + `aria-invalid` states. Adds a comfortable
 * min-height and vertical-only resize; callers override styles via `className`.
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
