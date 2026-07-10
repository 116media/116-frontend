import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

const POPULAR_SKELETON_ROWS = 10;

/**
 * PopularRowSkeleton
 *
 * @description
 * One placeholder row matching the horizontal video card's footprint: the same
 * bordered, padded shell around a stretched landscape thumbnail and the content
 * column beside it — a two-line title, the rating row, and a justified
 * share-count / date footer pinned to the bottom.
 */
export function PopularRowSkeleton() {
    return (
        <div className="flex gap-3 rounded-xl border p-3">
            <Skeleton className="min-h-18 w-28 shrink-0 self-stretch rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32" />
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="mt-2 h-4 w-24" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                </div>
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
        <div className="flex flex-col gap-4 rounded-xl bg-muted/25 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
            {Array.from({ length: rows }, (_, index) => index).map((row) => (
                <PopularRowSkeleton key={`popular-skeleton-${row}`} />
            ))}
        </div>
    );
}
