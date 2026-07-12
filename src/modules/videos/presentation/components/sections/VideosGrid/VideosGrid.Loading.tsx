import { VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for VideosGridLoading.
 *
 * @interface VideosGridLoadingProps
 * @property {number} [rows] - How many grid rows of skeletons to render (default one page).
 */
export interface VideosGridLoadingProps {
    rows?: number;
}

/**
 * VideosGridCardSkeleton
 *
 * @description
 * A single card-shaped shimmer block matching the vertical video card layout
 * (16:9 media, title lines, meta row), so replacing skeletons with real cards
 * causes no layout shift.
 */
function VideosGridCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="aspect-video rounded-lg" />
            <div className="flex flex-col gap-2 px-1">
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    );
}

/**
 * VideosGridLoading
 *
 * @description
 * Skeleton placeholder in the same 2/3/4-column grid layout as the real feed.
 * Used on first load (a full page of skeletons) and, with `rows={1}`, as the
 * next-page indicator under the grid while the following page loads.
 */
export function VideosGridLoading({ rows }: VideosGridLoadingProps) {
    const count = rows ? rows * 4 : VIDEOS_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {slots.map((slot) => (
                <VideosGridCardSkeleton key={slot} />
            ))}
        </div>
    );
}
