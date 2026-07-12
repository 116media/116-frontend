import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Base class string for the Card primitive.
 * Import and merge with cn() on any element that should carry card styling
 * without adding an extra DOM wrapper node.
 */
export const cardVariants = "rounded-lg border shadow-none hover:shadow-lg transition-shadow";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card
 *
 * @description
 * Root container for the Card compound component: a rounded bordered surface
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
