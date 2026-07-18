import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

const tagVariants = cva(
    "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-border bg-background text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:hover:border-secondary dark:hover:bg-secondary dark:hover:text-secondary-foreground",
                outline:
                    "border-border bg-transparent text-foreground hover:bg-surface-raised hover:text-primary dark:border-foreground/10 dark:hover:text-secondary",
                primary:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "border-transparent bg-transparent text-muted-foreground hover:bg-surface-raised hover:text-foreground"
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                md: "px-2.5 py-0.5 text-xs",
                lg: "px-3 py-1 text-sm"
            },
            shape: {
                rounded: "!rounded-md",
                pill: ""
            }
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            shape: "pill"
        }
    }
);

/**
 * Props for the Tag component.
 *
 * @interface TagProps
 *
 * @property {React.ReactNode} [prefix] - Node rendered before the label (e.g. "#" or an icon)
 * @property {React.ReactNode} [suffix] - Node rendered after the label (e.g. a count badge or icon)
 * @property {"a" | "div" | "span"} [as] - Underlying HTML element to render. Defaults to "a"
 * @property {string} [href] - Destination URL — only meaningful when as="a"
 * @property {string} [target] - Link target attribute — only meaningful when as="a"
 * @property {string} [rel] - Link rel attribute — only meaningful when as="a"
 */
export interface TagProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "prefix">,
        VariantProps<typeof tagVariants> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    as?: "a" | "div" | "span";
    href?: string;
    target?: string;
    rel?: string;
}

/**
 * Tag
 *
 * @description
 * Customizable pill/badge component for rendering tags, categories, or any label
 * that may or may not be a link. Supports variant, size, shape, prefix, and suffix
 * slots; all colors use theme.css tokens.
 */
export function Tag({
    className,
    variant,
    size,
    shape,
    prefix,
    suffix,
    as: Comp = "a",
    children,
    ...props
}: TagProps) {
    return (
        <Comp
            className={cn(tagVariants({ variant, size, shape }), className)}
            {...(props as React.HTMLAttributes<HTMLElement>)}
        >
            {prefix && <span className="shrink-0">{prefix}</span>}
            <span>{children}</span>
            {suffix && <span className="shrink-0">{suffix}</span>}
        </Comp>
    );
}

export { tagVariants };
