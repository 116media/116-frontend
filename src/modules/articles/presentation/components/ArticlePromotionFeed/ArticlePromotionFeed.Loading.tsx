/**
 * ArticlePromotionFeedLoading
 *
 * @description
 * Skeleton placeholder for the article promotion feed grid.
 * Mirrors the exact grid layout of ArticlePromotionFeed with
 * animate-pulse blocks so the page structure is visible while
 * the async server component streams in.
 * Used as the Suspense fallback on the homepage.
 */
export function ArticlePromotionFeedLoading() {
    return (
        <section className="grid grid-cols-1 gap-4 md:h-[80vh] md:grid-cols-[3fr_2fr]">
            <div className="grid gap-4 md:grid-rows-[4fr_2fr]">
                <div className="animate-pulse rounded-xl bg-muted" />

                <div className="grid grid-cols-2 gap-4">
                    <div className="animate-pulse rounded-xl bg-muted" />
                    <div className="animate-pulse rounded-xl bg-muted" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-rows-[2fr_2.5fr]">
                <div className="animate-pulse rounded-xl bg-muted" />

                <div className="flex flex-1 flex-col gap-4">
                    <div className="h-32 animate-pulse rounded-lg bg-muted" />
                    <div className="h-32 animate-pulse rounded-lg bg-muted" />
                    <div className="h-32 animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
        </section>
    );
}
