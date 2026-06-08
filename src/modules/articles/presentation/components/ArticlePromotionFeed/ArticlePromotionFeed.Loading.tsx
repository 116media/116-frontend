/**
 * ArticlePromotionFeedLoading
 *
 * @description
 * Skeleton placeholder for the article promotion feed grid.
 * Mirrors the exact grid layout of ArticlePromotionFeed with
 * card-shaped skeleton blocks. Responsive across mobile, tablet,
 * and desktop breakpoints.
 * Used as the Suspense fallback on the homepage.
 */
export function ArticlePromotionFeedLoading() {
    return (
        <section className="grid grid-cols-1 gap-2 overflow-hidden sm:gap-3 md:h-[80vh] md:gap-4 md:grid-cols-[3fr_2fr]">
            <div className="grid min-w-0 gap-2 overflow-hidden sm:gap-3 md:gap-4 md:grid-rows-[4fr_2fr]">
                {/* Hero skeleton */}
                <div className="min-h-64 animate-pulse rounded-xl bg-muted sm:min-h-80 md:min-h-0">
                    <div className="flex h-full flex-col justify-end p-4 md:p-6">
                        <div className="mb-3 h-5 w-24 rounded-full bg-muted-foreground/10" />
                        <div className="mb-2 h-5 w-3/4 rounded bg-muted-foreground/10 sm:h-6" />
                        <div className="mb-3 h-3 w-1/2 rounded bg-muted-foreground/10 sm:mb-4 sm:h-4" />
                        <div className="flex gap-3 sm:gap-4">
                            <div className="h-3 w-14 rounded bg-muted-foreground/10 sm:h-4 sm:w-16" />
                            <div className="h-3 w-14 rounded bg-muted-foreground/10 sm:h-4 sm:w-16" />
                        </div>
                    </div>
                </div>

                {/* Pair skeleton */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            className="min-h-48 animate-pulse rounded-xl bg-muted sm:min-h-56 md:min-h-0"
                        >
                            <div className="flex h-full flex-col justify-end p-3 sm:p-4">
                                <div className="mb-2 h-4 w-16 rounded-full bg-muted-foreground/10" />
                                <div className="mb-1 h-4 w-3/4 rounded bg-muted-foreground/10 sm:mb-2 sm:h-5" />
                                <div className="h-3 w-1/2 rounded bg-muted-foreground/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid min-w-0 gap-2 overflow-hidden sm:gap-3 md:gap-4 md:grid-rows-[2fr_2.5fr]">
                {/* Side skeleton */}
                <div className="animate-pulse rounded-xl border-2 border-muted bg-muted/30 p-4 sm:p-5 md:p-6">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                        <div className="h-3 w-20 rounded bg-muted-foreground/10 sm:h-4 sm:w-24" />
                        <div className="h-4 w-14 rounded-full bg-muted-foreground/10 sm:h-5 sm:w-16" />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                        <div className="h-36 w-full shrink-0 rounded-lg bg-muted sm:w-1/3" />
                        <div className="flex flex-1 flex-col gap-2 sm:gap-3">
                            <div className="h-4 w-3/4 rounded bg-muted-foreground/10 sm:h-5" />
                            <div className="h-3 w-full rounded bg-muted-foreground/10 sm:h-4" />
                            <div className="h-3 w-2/3 rounded bg-muted-foreground/10 sm:h-4" />
                        </div>
                    </div>
                </div>

                {/* Gossip strip skeleton */}
                <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-xl bg-muted/30 p-3 sm:gap-4 sm:p-4 md:p-6">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="flex min-w-0 flex-1 gap-2 sm:gap-3"
                        >
                            <div className="h-16 w-16 shrink-0 animate-pulse rounded-md bg-muted sm:h-20 sm:w-24 md:w-36" />
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
                                <div className="h-3 w-3/4 rounded bg-muted-foreground/10 sm:h-4" />
                                <div className="h-2.5 w-1/2 rounded bg-muted-foreground/10 sm:h-3" />
                                <div className="mt-auto h-2.5 w-16 rounded bg-muted-foreground/10 sm:h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
