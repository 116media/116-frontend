import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for FavoriteCard.Body.
 *
 * @interface FavoriteCardBodyProps
 * @property {ReactNode} children - The title, meta, comment, and action parts.
 * @property {string} [className] - Extra classes merged onto the body column.
 */
export interface FavoriteCardBodyProps {
    children: ReactNode;
    className?: string;
}

/**
 * FavoriteCard.Body
 *
 * @description
 * The padded content column below the media. Grows to fill the card so tiles in a row
 * keep equal height and any bottom-anchored action row lines up.
 */
export function FavoriteCardBody({ children, className }: FavoriteCardBodyProps) {
    return <div className={cn("flex flex-1 flex-col gap-2 p-3", className)}>{children}</div>;
}
