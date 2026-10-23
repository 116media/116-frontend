import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

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
                outline: "text-foreground",
                muted: "border-transparent bg-foreground/10 text-foreground"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

/**
 * Props for the Badge component.
 *
 * @interface BadgeProps
 * @augments HTMLAttributes<HTMLDivElement>
 * @augments VariantProps<typeof badgeVariants>
 */
export interface BadgeProps
    extends HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

/**
 * Badge
 *
 * @description
 * Compact inline label for status, category, or count indicators. Renders a span, so it is
 * valid inside a button such as a tab trigger. All colors use theme.css tokens. For a richer
 * tag/pill with link support and slots, use the Tag component instead.
 *
 * @param variant - Visual style: default | secondary | destructive | outline | muted
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { badgeVariants };
