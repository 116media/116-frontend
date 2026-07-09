import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the Separator component.
 *
 * @interface SeparatorProps
 * @property {"horizontal" | "vertical"} [orientation] - Rule direction (default horizontal).
 * @property {string} [className] - Extra classes (e.g. a fixed height for a vertical rule).
 */
export interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

/**
 * Separator
 *
 * @description
 * A thin themed divider. Horizontal spans full width (`h-px`), vertical spans full
 * height (`w-px`); both use the `--border` token. Rendered as an `<hr>` so the
 * separator role is implicit; `aria-orientation` marks the vertical variant.
 */
export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
    return (
        <hr
            aria-orientation={orientation}
            className={cn(
                "shrink-0 border-0 bg-border",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
        />
    );
}
