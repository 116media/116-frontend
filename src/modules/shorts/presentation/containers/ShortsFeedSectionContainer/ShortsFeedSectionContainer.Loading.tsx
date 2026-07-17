/**
 * Number of shimmer tiles shown while the shorts feed's first page loads.
 */
const SHIMMER_TILE_COUNT = 6;

/**
 * ShortsFeedSectionContainerLoading
 *
 * @description
 * Skeleton for the homepage shorts section: a header placeholder above a row of
 * 9:16 shimmer tiles at the strip's dimensions.
 */
export function ShortsFeedSectionContainerLoading() {
    return (
        <section
            className="flex flex-col gap-3"
            aria-hidden
        >
            <header className="flex flex-col gap-1.5">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </header>
            <div className="-mx-4 flex gap-3 overflow-hidden px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0">
                {Array.from({ length: SHIMMER_TILE_COUNT }, (_, index) => index).map((index) => (
                    <div
                        key={index}
                        className="aspect-9/16 w-36 shrink-0 animate-pulse rounded-lg bg-muted sm:w-40"
                    />
                ))}
            </div>
        </section>
    );
}
