import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * buttonGroupVariants
 *
 * @description
 * Joins a set of buttons into a single segmented control: no gap, shared edges, and
 * only the group's outer corners rounded. Inner buttons drop their touching radii and
 * borders per orientation; `items-stretch` keeps every button the same cross-size.
 */
const buttonGroupVariants = cva("flex w-fit items-stretch", {
    variants: {
        orientation: {
            horizontal:
                "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
            vertical:
                "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
        }
    },
    defaultVariants: {
        orientation: "horizontal"
    }
});

/**
 * Props for the ButtonGroup component.
 *
 * @interface ButtonGroupProps
 * @augments HTMLAttributes<HTMLDivElement>
 * @property {"horizontal" | "vertical"} [orientation] - Join direction of the grouped
 * buttons. Defaults to `horizontal`.
 */
export interface ButtonGroupProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof buttonGroupVariants> {}

/**
 * ButtonGroup
 *
 * @description
 * Groups related buttons into a seamless segmented control (shadcn-style): buttons
 * sit edge-to-edge with inner borders collapsed, so only the outer corners stay
 * rounded. Exposes the `group` ARIA role and `data-orientation`.
 */
export function ButtonGroup({ orientation, className, ...props }: ButtonGroupProps) {
    return (
        // biome-ignore lint/a11y/useSemanticElements: a button group is a generic ARIA group, not a form fieldset
        <div
            role="group"
            data-slot="button-group"
            data-orientation={orientation ?? "horizontal"}
            className={cn(buttonGroupVariants({ orientation }), className)}
            {...props}
        />
    );
}
