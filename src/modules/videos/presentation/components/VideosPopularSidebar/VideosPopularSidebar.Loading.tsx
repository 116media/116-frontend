import { Fragment } from "react";

import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

const POPULAR_SKELETON_ROWS = 5;

/**
 * VideosPopularSidebarLoading
 *
 * @description
 * The loading placeholder for the popular strip: rows shaped like the
 * horizontal episode card (a thumbnail block plus title/rating/date-share
 * lines, separated by rules) inside the same muted block, so no layout shift
 * occurs when the videos resolve. Rendered by {@link VideosPopularSidebar}
 * under its section header while the popular query is pending.
 */
export function VideosPopularSidebarLoading() {
    const rows = Array.from({ length: POPULAR_SKELETON_ROWS }, (_, index) => index);
    return (
        <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
            {rows.map((row) => (
                <Fragment key={row}>
                    <div className="flex gap-2 sm:gap-3">
                        <Skeleton className="min-h-18 w-28 shrink-0 rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32" />
                        <div className="flex flex-1 flex-col gap-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="mt-auto h-3 w-2/3" />
                        </div>
                    </div>
                    {row < POPULAR_SKELETON_ROWS - 1 && <hr />}
                </Fragment>
            ))}
        </div>
    );
}
