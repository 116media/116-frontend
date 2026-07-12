import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { SpinnerIcon } from "@/shared/presentation/components/ui/Icon";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

export const buttonVariants = cva(
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                "brand-outline":
                    "border bg-transparent text-primary dark:text-secondary border-primary/30 dark:border-secondary/30 hover:bg-primary/10 hover:text-primary dark:hover:bg-secondary/10 dark:hover:text-secondary dark:hover:border-secondary",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary dark:text-secondary underline-offset-4 hover:underline"
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

/**
 * Props for the Button component.
 *
 * @interface ButtonProps
 *
 * @property {boolean} [asChild] - Render as the child element using Radix Slot instead of a button
 * @property {boolean} [loading] - Show a centered spinner over the label and disable the button
 */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

/**
 * Button
 *
 * @description
 * shadcn/ui button component with variant and size support.
 * All colors reference CSS tokens from theme.css — no hardcoded values.
 * Pass `asChild` to render as a different element (e.g. an anchor tag).
 */
export function Button({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    // Slot forwards to an arbitrary element (e.g. an anchor) and demands a single
    // child, so the spinner overlay only applies to a real <button>. The label stays
    // visible; the spinner is layered on top of it, so the button never resizes.
    if (asChild) {
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                {children}
            </Comp>
        );
    }

    return (
        <Comp
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={cn(buttonVariants({ variant, size, className }), loading && "relative")}
            {...props}
        >
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <SpinnerIcon
                        aria-hidden
                        strokeWidth={3}
                        className="size-6! animate-spin"
                    />
                </span>
            )}
            <span className={cn("inline-flex items-center gap-2", loading && "opacity-30")}>
                {children}
            </span>
        </Comp>
    );
}
