import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

/**
 * Badge
 *
 * @description
 * Compact inline label for status, category, or count indicators.
 * Built on CVA with the four standard shadcn variants: default, secondary,
 * destructive, and outline. All colors use theme.css tokens — no hardcoded values.
 *
 * For a richer tag/pill component with link support, prefix/suffix slots,
 * and additional variants, use the Tag component instead.
 *
 * @param variant - Visual style: default | secondary | destructive | outline
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { badgeVariants };
