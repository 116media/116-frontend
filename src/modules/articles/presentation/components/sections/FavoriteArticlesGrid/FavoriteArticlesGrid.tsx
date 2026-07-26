import type { ReactNode } from "react";

/**
 * Props for FavoriteArticlesGrid.
 *
 * @interface FavoriteArticlesGridProps
 * @property {ReactNode} children - The article tiles to lay out.
 */
export interface FavoriteArticlesGridProps {
    children: ReactNode;
}

/**
 * FavoriteArticlesGrid
 *
 * @description
 * The responsive grid shared by the bookmarked, liked, shared, and commented article
 * islands: one column on mobile, two on tablet, three on laptop, and four only on very
 * large desktop. Purely presentational; the section owns data, tile content, and paging.
 */
export function FavoriteArticlesGrid({ children }: FavoriteArticlesGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {children}
        </div>
    );
}
