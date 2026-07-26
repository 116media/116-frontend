import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for FavoriteCard.Title.
 *
 * @interface FavoriteCardTitleProps
 * @property {ReactNode} children - The title text.
 * @property {string} [href] - Detail-page link target; renders the title as an anchor.
 * @property {() => void} [onOpen] - Click handler used when no `href` is given.
 * @property {string} [className] - Extra classes merged onto the heading.
 * @property {string} [contentClassName] - Extra classes merged onto the link or button.
 */
export interface FavoriteCardTitleProps {
    children: ReactNode;
    href?: string;
    className?: string;
    onOpen?: () => void;
    contentClassName?: string;
}

const TITLE_CLASS = "line-clamp-2 cursor-pointer text-left hover:underline";

/**
 * FavoriteCard.Title
 *
 * @description
 * The item title inside the body, rendered as a link when `href` is set and a button
 * otherwise. Clamps to two lines and underlines on hover.
 */
export function FavoriteCardTitle({
    children,
    href,
    onOpen,
    className,
    contentClassName
}: FavoriteCardTitleProps) {
    return (
        <h3 className={cn("font-semibold text-foreground text-sm leading-snug", className)}>
            {href ? (
                <Link
                    href={href}
                    className={cn(TITLE_CLASS, contentClassName)}
                >
                    {children}
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={onOpen}
                    className={cn(TITLE_CLASS, contentClassName)}
                >
                    {children}
                </button>
            )}
        </h3>
    );
}
