import { VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for FavoriteVideosGridLoading.
 *
 * @interface FavoriteVideosGridLoadingProps
 * @property {number} [rows] - How many grid rows of skeletons to render (default one page).
 */
export interface FavoriteVideosGridLoadingProps {
    rows?: number;
}

/**
 * FavoriteVideoCardSkeleton
 *
 * @description
 * A single card-shaped shimmer mirroring the favorites video tile: a bordered card with
 * 16:9 media, a two-line title, the published-date/share/rating meta row, and the activity
 * meta line — so swapping skeletons for real cards causes no layout shift.
 */
function FavoriteVideoCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <Skeleton className="aspect-video rounded-none" />
            <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-28" />
            </div>
        </div>
    );
}

/**
 * FavoriteVideosGridLoading
 *
 * @description
 * Skeleton placeholder for {@link FavoriteVideosGrid} in the same 1/2/3/4-column layout.
 * Used on first load (a full page of skeletons) and, with `rows={1}`, as the next-page
 * indicator under the grid while the following page loads.
 */
export function FavoriteVideosGridLoading({ rows }: FavoriteVideosGridLoadingProps) {
    const count = rows ? rows * 4 : VIDEOS_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {slots.map((slot) => (
                <FavoriteVideoCardSkeleton key={slot} />
            ))}
        </div>
    );
}
