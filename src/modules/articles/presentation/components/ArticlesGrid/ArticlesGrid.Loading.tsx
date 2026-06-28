import { ARTICLES_PAGE_SIZE } from "@/modules/articles/presentation/constants/articleKeys";

import { ArticlesGridCardSkeleton } from "./ArticlesGrid.CardSkeleton";

/**
 * Props for ArticlesGridLoading.
 *
 * @interface ArticlesGridLoadingProps
 * @property {number} [rows] - How many grid rows of skeletons to render (default one page).
 */
export interface ArticlesGridLoadingProps {
    rows?: number;
}

/**
 * ArticlesGridLoading
 *
 * @description
 * Skeleton placeholder in the same 1/2/4-column grid layout as the real feed. Used on
 * first load (a full page of skeletons) and, with `rows={1}`, as the next-page indicator
 * under the grid while the following page loads.
 *
 * @param rows - How many grid rows of skeletons to render (default one page).
 */
export function ArticlesGridLoading({ rows }: ArticlesGridLoadingProps) {
    const count = rows ? rows * 4 : ARTICLES_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {slots.map((slot) => (
                <ArticlesGridCardSkeleton key={slot} />
            ))}
        </div>
    );
}
