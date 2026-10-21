import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the Separator component.
 *
 * @interface SeparatorProps
 * @property {"horizontal" | "vertical"} [orientation] - Rule direction (default horizontal).
 * @property {string} [className] - Extra classes, e.g. a fixed height for a vertical rule or
 * a `bg-*` override for the line colour.
 */
export interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

/**
 * Separator
 *
 * @description
 * A thin themed divider. Horizontal spans full width (`h-px`), vertical spans full height
 * (`w-px`); the line is painted with the `outlined` token as a background, so a call site
 * recolours it with `bg-*`. Rendered as an `<hr>`, with `aria-orientation` on the vertical.
 */
export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
    return (
        <hr
            aria-orientation={orientation}
            className={cn(
                "shrink-0 border-0 bg-outlined",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
                className
            )}
        />
    );
}
