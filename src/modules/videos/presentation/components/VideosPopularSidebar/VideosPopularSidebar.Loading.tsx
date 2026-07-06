import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

const POPULAR_SKELETON_ROWS = 10;

/**
 * PopularRowSkeleton
 *
 * @description
 * One placeholder row shaped like the horizontal episode card — a thumbnail
 * block plus title/rating/date-share lines. Bare (no muted wrapper), so it
 * composes into the full loading block.
 */
export function PopularRowSkeleton() {
    return (
        <div className="flex gap-2 sm:gap-3">
            <Skeleton className="min-h-18 w-28 shrink-0 rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-auto h-3 w-2/3" />
            </div>
        </div>
    );
}

/**
 * Props for {@link VideosPopularSidebarLoading}.
 *
 * @interface VideosPopularSidebarLoadingProps
 * @property {number} [rows] - How many placeholder rows to render. Defaults to ten.
 */
export interface VideosPopularSidebarLoadingProps {
    rows?: number;
}

/**
 * VideosPopularSidebarLoading
 *
 * @description
 * The loading placeholder for the popular strip: `rows` horizontal-card row
 * skeletons inside the same muted block, so no layout shift occurs when the
 * videos resolve. Rendered by {@link VideosPopularSidebar} under its section
 * header while the popular query is pending.
 *
 * @param rows - How many placeholder rows to render. Defaults to ten.
 */
export function VideosPopularSidebarLoading({
    rows = POPULAR_SKELETON_ROWS
}: VideosPopularSidebarLoadingProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
            {Array.from({ length: rows }, (_, index) => index).map((row) => (
                <PopularRowSkeleton key={`popular-skeleton-${row}`} />
            ))}
        </div>
    );
}
