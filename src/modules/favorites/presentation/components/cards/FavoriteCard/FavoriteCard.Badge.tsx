import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for FavoriteCard.Badge.
 *
 * @interface FavoriteCardBadgeProps
 * @property {ReactNode} children - The pill contents (count, label, or glyph).
 * @property {string} [className] - Extra classes to reposition or restyle the pill.
 */
export interface FavoriteCardBadgeProps {
    children: ReactNode;
    className?: string;
}

/**
 * FavoriteCard.Badge
 *
 * @description
 * A translucent overlay pill anchored to the media (top-right by default) for a count or
 * short label. Rendered as a media overlay child, above the open button.
 */
export function FavoriteCardBadge({ children, className }: FavoriteCardBadgeProps) {
    return (
        <span
            className={cn(
                "absolute top-2 right-2 z-10 rounded-full bg-black/70 px-2 py-0.5 font-medium text-[11px] text-white",
                className
            )}
        >
            {children}
        </span>
    );
}
