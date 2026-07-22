import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Number of shimmer tiles shown while the shorts feed's first page loads.
 */
const SHIMMER_TILE_COUNT = 8;

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
            <header>
                <Skeleton className="h-5 w-24" />
            </header>
            <div className="-mx-4 flex gap-3 overflow-hidden px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0">
                {Array.from({ length: SHIMMER_TILE_COUNT }, (_, index) => index).map((index) => (
                    <Skeleton
                        key={index}
                        className="aspect-9/16 w-36 shrink-0 rounded-lg sm:w-40"
                    />
                ))}
            </div>
        </section>
    );
}
