import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Props for FavoriteCard.Title.
 *
 * @interface FavoriteCardTitleProps
 * @property {ReactNode} children - The title text.
 * @property {string} [href] - Detail-page link target; renders the title as an anchor.
 * @property {() => void} [onOpen] - Click handler used when no `href` is given.
 */
export interface FavoriteCardTitleProps {
    children: ReactNode;
    href?: string;
    onOpen?: () => void;
}

/**
 * Shared clamp/underline classes for the title link or button.
 */
const TITLE_CLASS = "line-clamp-2 cursor-pointer text-left hover:underline";

/**
 * FavoriteCard.Title
 *
 * @description
 * The item title inside the body, rendered as a link when `href` is set and a button
 * otherwise. Clamps to two lines and underlines on hover.
 */
export function FavoriteCardTitle({ children, href, onOpen }: FavoriteCardTitleProps) {
    return (
        <h3 className="font-semibold text-foreground text-sm leading-snug">
            {href ? (
                <Link
                    href={href}
                    className={TITLE_CLASS}
                >
                    {children}
                </Link>
            ) : (
                <button
                    type="button"
                    onClick={onOpen}
                    className={TITLE_CLASS}
                >
                    {children}
                </button>
            )}
        </h3>
    );
}
