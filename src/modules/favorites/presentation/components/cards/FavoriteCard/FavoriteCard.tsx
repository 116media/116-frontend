import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the FavoriteCard root.
 *
 * @interface FavoriteCardProps
 * @property {ReactNode} children - The media region and body composed from the card parts.
 * @property {string} [className] - Extra classes merged onto the article container.
 */
export interface FavoriteCardProps {
    children: ReactNode;
    className?: string;
}

/**
 * FavoriteCard root
 *
 * @description
 * The bordered card shell every favorites tile is built on: a `group` article with a
 * fixed rounded border and hover shadow so activity meta, actions, and remove
 * affordances all sit inside one frame.
 */
export function FavoriteCardRoot({ children, className }: FavoriteCardProps) {
    return (
        <article
            className={cn(
                "group flex flex-col overflow-hidden rounded-xl border bg-card",
                className
            )}
        >
            {children}
        </article>
    );
}
