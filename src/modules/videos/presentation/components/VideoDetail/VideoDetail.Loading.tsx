import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * SidebarRowSkeleton
 *
 * @description
 * One placeholder row shaped like the horizontal episode card (a thumbnail
 * block plus title/rating/date lines) for the popular-sidebar column of the
 * full-page skeleton.
 */
function SidebarRowSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="min-h-18 w-28 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-auto h-3 w-2/3" />
            </div>
        </div>
    );
}

/**
 * VideoDetailLoading
 *
 * @description
 * Full-page skeleton for the video detail route. Reproduces the player block
 * (a 16:9 rectangle), the header (category chip, two title lines, a meta
 * line, an action-button row), the tag row, the tab bar with description
 * lines, and — on wide screens — the popular-sidebar skeleton with its
 * `SectionHeader`-shaped heading. Every block is the shared `Skeleton`
 * primitive, so shimmer, radius, and spacing match the feed skeletons and no
 * layout shift occurs when the video resolves.
 */
export function VideoDetailLoading() {
    const descriptionLines = Array.from({ length: 6 }, (_, index) => index);
    const sidebarRows = Array.from({ length: 5 }, (_, index) => index);
    return (
        <div className="lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:gap-6">
            <div className="flex min-w-0 flex-col gap-6">
                <Skeleton className="aspect-video w-full rounded-lg" />

                <div className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-4 w-14" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-8 w-36 rounded-lg" />
                    </div>
                </div>

                <div className="flex gap-2 border-t pt-6">
                    {[0, 1, 2, 3].map((tag) => (
                        <Skeleton
                            key={tag}
                            className="h-7 w-20 rounded-full"
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <Skeleton className="h-9 w-72 rounded-lg" />
                    <div className="flex flex-col gap-3">
                        {descriptionLines.map((line) => (
                            <Skeleton
                                key={line}
                                className={line % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <aside className="hidden lg:flex lg:flex-col lg:gap-3">
                <div className="mb-4 flex items-center gap-3 border-b pb-4">
                    <Skeleton className="size-12 rounded-md" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex flex-col gap-8 rounded-xl bg-muted/30 p-3 xl:p-5">
                    {sidebarRows.map((row) => (
                        <SidebarRowSkeleton key={row} />
                    ))}
                </div>
            </aside>
        </div>
    );
}
