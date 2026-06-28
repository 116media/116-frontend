/**
 * ArticlesGridCardSkeleton
 *
 * @description
 * A single card-shaped shimmer block matching the article card layout (16:9 media, meta,
 * title, and action lines), so replacing skeletons with real cards causes no layout shift.
 */
export function ArticlesGridCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-background">
            <div className="aspect-video animate-pulse bg-muted" />
            <div className="flex flex-col gap-3 p-5">
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}
