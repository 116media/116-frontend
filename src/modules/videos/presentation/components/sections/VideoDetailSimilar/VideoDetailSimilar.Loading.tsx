import { SIMILAR_VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * One placeholder card matching the vertical-card footprint (16:9 block plus title/meta
 * lines), used for the first-load grid and the fetching tail.
 */
function SimilarCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

/**
 * Props for VideoDetailSimilar.Loading.
 *
 * @interface VideoDetailSimilarLoadingProps
 * @property {number} [count] - How many skeleton cards to render. Defaults to a full page.
 */
export interface VideoDetailSimilarLoadingProps {
    count?: number;
}

/**
 * VideoDetailSimilar.Loading
 *
 * @description
 * A run of skeleton cards for the similar-videos grid — rendered inside the caller's grid
 * so the first-load fill and the next-page tail share one placeholder.
 */
export function VideoDetailSimilarLoading({
    count = SIMILAR_VIDEOS_PAGE_SIZE
}: VideoDetailSimilarLoadingProps) {
    return (
        <>
            {Array.from({ length: count }, (_, index) => index).map((row) => (
                <SimilarCardSkeleton key={`similar-skeleton-${row}`} />
            ))}
        </>
    );
}
