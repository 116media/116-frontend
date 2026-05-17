import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

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
 * Root container for the Card compound component.
 * Renders a rounded bordered surface with a subtle shadow.
 * All colors use theme.css tokens — no hardcoded values.
 *
 * For cases where adding a wrapper div would break layout (e.g. interactive
 * Link elements or elements with fill images), import cardVariants directly
 * and merge it into the existing element's className via cn().
 */
export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(cardVariants, "bg-card text-card-foreground", className)}
            {...props}
        />
    );
}
