import type { ReactNode } from "react";

/**
 * Props for FavoriteVideosGrid.
 *
 * @interface FavoriteVideosGridProps
 * @property {ReactNode} children - The video tiles to lay out.
 */
export interface FavoriteVideosGridProps {
    children: ReactNode;
}

/**
 * FavoriteVideosGrid
 *
 * @description
 * The responsive grid shared by the rated and shared video islands: one column on mobile,
 * two on tablet, three on laptop, and four only on very large desktop. Purely
 * presentational; the section owns data, tile content, and paging.
 */
export function FavoriteVideosGrid({ children }: FavoriteVideosGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {children}
        </div>
    );
}
