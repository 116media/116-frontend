import { Suspense } from "react";
import { VideoExclusiveShowHeroLoading } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/VideoExclusiveShow.Hero.Loading";
import { ShowsSectionContainer } from "@/modules/videos/presentation/containers/ShowsSectionContainer";
import { VideoExclusiveShowContainer } from "@/modules/videos/presentation/containers/VideoExclusiveShowContainer";
import { VideosFeedContainer } from "@/modules/videos/presentation/containers/VideosFeedContainer";

/**
 * Props for the videos listing route.
 *
 * @interface VideosPageProps
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - The route
 * query params promise carrying the optional `search`, `categoryId`, and `tagSlug` filters.
 */
interface VideosPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * firstParam
 *
 * @description
 * Normalizes a query-param value to a single string. A repeated param arrives
 * as an array, from which the first entry is taken; a missing param stays
 * undefined.
 *
 * @param value - The raw query-param value.
 * @returns The single string value, or undefined when absent.
 */
function firstParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * VideosPage
 *
 * @description
 * The public videos listing (`/videos`): the exclusive show hero and the shows
 * carousel above the browse feed — the sticky filter toolbar and an
 * infinite-scrolling grid of every published video. Awaits the route query
 * params and seeds the feed's filters from them, so deep links like
 * `/videos?categoryId=…` (used by the mega menu) open pre-filtered.
 *
 * @param searchParams - The route query params promise carrying the optional filters.
 */
export default async function VideosPage({ searchParams }: VideosPageProps) {
    const params = await searchParams;

    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            {/* Exclusive show — featured category and its episodes */}
            <Suspense fallback={<VideoExclusiveShowHeroLoading />}>
                <VideoExclusiveShowContainer variant="hero" />
            </Suspense>

            {/* Shows — swipeable carousel of video categories */}
            <ShowsSectionContainer />

            {/* Browse — sticky filter toolbar + infinite video grid */}
            <VideosFeedContainer
                initialSearch={firstParam(params.search)}
                initialCategoryId={firstParam(params.categoryId)}
                initialTagSlug={firstParam(params.tagSlug)}
            />
        </div>
    );
}
