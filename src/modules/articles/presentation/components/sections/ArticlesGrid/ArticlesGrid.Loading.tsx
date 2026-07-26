import { ARTICLES_PAGE_SIZE } from "@/modules/articles/presentation/constants/articleKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for ArticlesGridLoading.
 *
 * @interface ArticlesGridLoadingProps
 * @property {number} [rows] - How many grid rows of skeletons to render (default one page).
 */
export interface ArticlesGridLoadingProps {
    rows?: number;
}

/**
 * ArticlesGridCardSkeleton
 *
 * @description
 * A single card-shaped shimmer mirroring {@link ArticleCard.Feed}: 16:9 media, the
 * author/date byline row, the category tag + read-time meta row, a two-line title, a
 * two-line headline, and the engagement bar — so swapping skeletons for real cards
 * causes no layout shift. Built from the shared Skeleton primitive.
 */
function ArticlesGridCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-background">
            <Skeleton className="aspect-video rounded-none" />
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-3 w-14" />
                </div>

                <div className="mb-3 flex flex-col gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-12 rounded-md" />
                        <Skeleton className="h-8 w-12 rounded-md" />
                        <Skeleton className="h-8 w-12 rounded-md" />
                    </div>
                    <Skeleton className="size-8 rounded-md" />
                </div>
            </div>
        </div>
    );
}

/**
 * ArticlesGridLoading
 *
 * @description
 * Skeleton placeholder in the same 1/2/4-column grid layout as the real feed. Used on
 * first load (a full page of skeletons) and, with `rows={1}`, as the next-page indicator
 * under the grid while the following page loads.
 */
export function ArticlesGridLoading({ rows }: ArticlesGridLoadingProps) {
    const count = rows ? rows * 4 : ARTICLES_PAGE_SIZE;
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {slots.map((slot) => (
                <ArticlesGridCardSkeleton key={slot} />
            ))}
        </div>
    );
}
