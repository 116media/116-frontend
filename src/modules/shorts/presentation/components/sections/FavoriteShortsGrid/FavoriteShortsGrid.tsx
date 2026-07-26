import type { ReactNode } from "react";

/**
 * Props for FavoriteShortsGrid.
 *
 * @interface FavoriteShortsGridProps
 * @property {ReactNode} children - The short-video tiles to lay out.
 */
export interface FavoriteShortsGridProps {
    children: ReactNode;
}

/**
 * FavoriteShortsGrid
 *
 * @description
 * The responsive portrait grid shared by the liked, saved, and shared shorts islands.
 * Purely presentational; the section owns data, tile content, and paging.
 */
export function FavoriteShortsGrid({ children }: FavoriteShortsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {children}
        </div>
    );
}
