"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Input
 *
 * @description
 * The base text-input primitive — the shadcn/ui input: transparent surface
 * (`dark:bg-input/30` in dark), `border-input` border, `rounded-lg` corners, the shadcn
 * focus ring (`ring-3 ring-ring/50` + `border-ring`), file-input styling, and the
 * disabled + `aria-invalid` states (light and dark) — all theme tokens, so light/dark
 * are automatic. Specialized fields (the floating-label `FloatingField`, the segmented
 * `OtpInput`) render this and override sizing, padding, or radius via `className`
 * (merged by `cn`, so later utilities win).
 *
 * @param className - Extra classes merged onto (and overriding) the base styles.
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type = "text", ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            data-slot="input"
            className={cn(
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
                "h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "text-base outline-none transition-colors md:text-sm, placeholder:text-muted-foreground",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/20",
                className
            )}
            {...props}
        />
    )
);
Input.displayName = "Input";
