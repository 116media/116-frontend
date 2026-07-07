import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Skeleton component.
 *
 * @interface SkeletonProps
 * @augments HTMLAttributes<HTMLDivElement>
 */
export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Skeleton
 *
 * @description
 * A pulsing placeholder block used while content loads. Renders an `animate-pulse`
 * `bg-muted` rounded shape — the same shimmer idiom the feed skeletons use — so loading
 * surfaces stay visually consistent across the app. Size and radius are supplied by the
 * caller via `className`.
 *
 * @param className - Sizing, radius, and layout classes merged onto the block.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded bg-muted", className)}
            {...props}
        />
    );
}
