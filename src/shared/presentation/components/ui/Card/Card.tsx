import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Base class string for the Card primitive.
 * Import and merge with cn() on any element that should carry card styling
 * without adding an extra DOM wrapper node.
 *
 * The edge is a tint of the foreground rather than a fixed grey: a card sits on
 * surfaces of its own lightness in each theme, and a literal border reads on only one
 * of them. Hover moves that edge to the accent instead of raising a shadow.
 */
export const cardVariants = cn(
    "rounded-base border border-foreground/[0.075] transition-colors",
    "hover:border-primary/40 dark:hover:border-secondary/40"
);

/**
 * Props for the Card component.
 *
 * @interface CardProps
 * @augments HTMLAttributes<HTMLDivElement>
 */
export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card
 *
 * @description
 * Root container for the Card compound component: a rounded-base bordered surface
 * using theme.css tokens. Where a wrapper div would break layout, import
 * cardVariants directly and merge it into the existing element's className.
 */
export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(cardVariants, "bg-card text-card-foreground", className)}
            {...props}
        />
    );
}
