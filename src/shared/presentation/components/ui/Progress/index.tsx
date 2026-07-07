import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Progress component.
 *
 * @interface ProgressProps
 * @augments HTMLAttributes<HTMLDivElement>
 * @property {number} value - The current progress, 0..100 (clamped).
 * @property {string} [indicatorClassName] - Extra classes merged onto the indicator (fill),
 * e.g. a token background color. Merged last, so it overrides the default `bg-primary`.
 */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    indicatorClassName?: string;
}

/**
 * Progress
 *
 * @description
 * A slim themed progress bar. A muted track holds a primary-colored indicator whose width
 * tracks `value` (0..100, clamped). Exposes the progressbar ARIA role and value bounds.
 * Colors are theme tokens; only the indicator width is inline, a computed geometric value.
 * The indicator transitions width (snappy, so it can track continuous updates like scroll)
 * and background-color (slower, so a token color swap via `indicatorClassName` morphs
 * smoothly rather than snapping) with per-property durations.
 *
 * @param value - The current progress, 0..100 (clamped).
 * @param className - Extra classes merged onto the track.
 * @param indicatorClassName - Extra classes merged onto the indicator (e.g. a token color).
 */
export function Progress({ value, className, indicatorClassName, ...props }: ProgressProps) {
    const clamped = Math.min(100, Math.max(0, value));
    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn("h-1 w-full overflow-hidden rounded bg-muted", className)}
            {...props}
        >
            <div
                className={cn("h-full bg-primary", indicatorClassName)}
                style={{
                    width: `${clamped}%`,
                    transitionProperty: "width, background-color",
                    transitionDuration: "150ms, 700ms",
                    transitionTimingFunction: "ease-out"
                }}
            />
        </div>
    );
}
