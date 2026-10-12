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
 * Full-page skeleton for the article detail route, mirroring the real order of
 * breadcrumb, tag, title, byline, cover, summary, meta bar and body so no layout
 * shift occurs when the article resolves.
 */
export function ArticleDetailLoading() {
    const bodyLines = Array.from({ length: 8 }, (_, index) => index);
    const sidebarRows = Array.from({ length: 5 }, (_, index) => index);

    return (
        <div className="lg:grid lg:grid-cols-[auto_minmax(0,2.5fr)_minmax(0,2fr)] lg:gap-6">
            <aside className="hidden lg:block lg:w-9" />

            <div className="mt-6 flex min-w-0 flex-col gap-4 lg:mt-0">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                </div>

                <div className="flex flex-col gap-3">
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-10 w-full md:h-12" />
                    <Skeleton className="h-10 w-4/5 md:h-12" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                </div>

                <Skeleton className="aspect-video w-full rounded-xl md:aspect-auto md:h-[60vh]" />

                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-11/12" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-y py-3">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-24 rounded-lg" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="mt-2 flex flex-col gap-3">
                    {bodyLines.map((line) => (
                        <Skeleton
                            key={line}
                            className={line % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-1 border-t pt-6">
                    <Skeleton className="mr-2 h-4 w-14" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-16 rounded-full" />
                </div>
            </div>

            <aside className="mt-12 hidden lg:mt-0 lg:flex lg:flex-col lg:gap-3">
                <div className="mb-4 flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
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
