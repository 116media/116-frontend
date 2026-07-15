import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * SidebarRowSkeleton
 *
 * @description
 * One placeholder row shaped like the gossip strip card (a thumbnail block plus
 * title/headline/date lines) for the popular-sidebar column of the full-page skeleton.
 */
function SidebarRowSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="min-h-18 w-28 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="mt-auto h-3 w-24" />
            </div>
        </div>
    );
}

/**
 * ArticleDetailLoading
 *
 * @description
 * Full-page skeleton for the article detail route, mirroring the hero, body, and
 * popular-sidebar shapes so no layout shift occurs when the article resolves.
 */
export function ArticleDetailLoading() {
    const bodyLines = Array.from({ length: 8 }, (_, index) => index);
    const sidebarRows = Array.from({ length: 5 }, (_, index) => index);
    return (
        <div className="lg:grid lg:grid-cols-[auto_minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
            <aside className="hidden lg:block lg:w-9" />

            <div className="flex min-w-0 flex-col gap-6">
                <Skeleton className="aspect-video w-full rounded-xl md:aspect-auto md:h-[60vh]" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                </div>
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="mt-4 flex flex-col gap-3">
                    {bodyLines.map((line) => (
                        <Skeleton
                            key={line}
                            className={line % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t pt-6">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
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
