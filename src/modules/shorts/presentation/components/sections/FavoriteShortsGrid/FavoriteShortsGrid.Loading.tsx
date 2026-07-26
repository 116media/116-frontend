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
 * Full-bleed portrait skeleton for {@link FavoriteShortsGrid}, including the title,
 * view count, and overlaid activity panel.
 */
export function FavoriteShortsGridLoading({ rows }: FavoriteShortsGridLoadingProps) {
    const count = rows ? rows * 6 : SHORTS_FAVORITES_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => (
                <div
                    key={slot}
                    className="relative aspect-9/16 overflow-hidden rounded-xl border bg-card"
                >
                    <Skeleton className="absolute inset-0 rounded-none" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}
