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
 * A single card-shaped shimmer block matching the article card layout (16:9 media, meta,
 * title, and action lines), so replacing skeletons with real cards causes no layout shift.
 * Built from the shared Skeleton primitive so the shimmer idiom stays consistent.
 */
function ArticlesGridCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-background">
            <Skeleton className="aspect-video rounded-none" />
            <div className="flex flex-col gap-3 p-5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
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
