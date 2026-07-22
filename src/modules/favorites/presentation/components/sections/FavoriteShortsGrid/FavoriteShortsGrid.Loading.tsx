import { SHORTS_FAVORITES_PAGE_SIZE } from "@/modules/shorts/presentation/constants/shortKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for FavoriteShortsGridLoading.
 *
 * @interface FavoriteShortsGridLoadingProps
 * @property {number} [rows] - How many grid rows of skeletons to render (default one page).
 */
export interface FavoriteShortsGridLoadingProps {
    rows?: number;
}

/**
 * FavoriteShortsGridLoading
 *
 * @description
 * Skeleton placeholder for {@link FavoriteShortsGrid}, matching the portrait 9:16 tile
 * layout so swapping in real tiles causes no layout shift.
 */
export function FavoriteShortsGridLoading({ rows }: FavoriteShortsGridLoadingProps) {
    const count = rows ? rows * 6 : SHORTS_FAVORITES_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => (
                <Skeleton
                    key={slot}
                    className="aspect-9/16 rounded-lg"
                />
            ))}
        </div>
    );
}
