import { Suspense } from "react";
import { ArticlePromotionFeedLoading } from "@/modules/articles/presentation/components/sections/ArticlePromotionFeed/ArticlePromotionFeed.Loading";
import { ArticlePromotionFeedContainer } from "@/modules/articles/presentation/containers/ArticlePromotionFeedContainer";
import { ArticlesFeedContainer } from "@/modules/articles/presentation/containers/ArticlesFeedContainer";

/**
 * Props for the articles listing route.
 *
 * @interface ArticlesPageProps
 * @property {Promise<Record<string, string | string[] | undefined>>} searchParams - The route
 * query params promise carrying the optional `search`, `categoryId`, and `tagSlug` filters.
 */
interface ArticlesPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * firstParam
 *
 * @description
 * Normalizes a query-param value to a single string. A repeated param arrives as an array,
 * from which the first entry is taken; a missing param stays undefined.
 *
 * @param value - The raw query-param value.
 * @returns The single string value, or undefined when absent.
 */
function firstParam(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * ArticlesPage
 *
 * @description
 * The public articles listing (`/articles`): the promoted-articles feed (reused from the
 * homepage, server-rendered inside its own `<Suspense>` boundary) above the filter toolbar
 * and an infinite-scrolling grid of every published article. Awaits the route query params
 * and seeds the feed's filters from them, so deep links like `/articles?tagSlug=music`
 * (used by the article tag pills) open pre-filtered.
 *
 * @param searchParams - The route query params promise carrying the optional filters.
 */
export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const params = await searchParams;

    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>
            <ArticlesFeedContainer
                initialSearch={firstParam(params.search)}
                initialCategoryId={firstParam(params.categoryId)}
                initialTagSlug={firstParam(params.tagSlug)}
            />
        </div>
    );
}
