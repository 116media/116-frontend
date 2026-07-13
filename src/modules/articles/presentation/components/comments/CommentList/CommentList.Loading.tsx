import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * A single comment-shaped shimmer block (avatar, name line, two body lines) matching the
 * row layout, so replacing skeletons with real comments causes no layout shift.
 */
function CommentSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    );
}

/**
 * Props for CommentList.Loading.
 *
 * @interface CommentListLoadingProps
 * @property {number} [count] - How many comment skeleton rows to render. Defaults to 4.
 */
export interface CommentListLoadingProps {
    count?: number;
}

/**
 * CommentList.Loading
 *
 * @description
 * A run of comment-row skeletons rendered inside the caller's list wrapper — used for the
 * first load and the next-page fetching tail.
 */
export function CommentListLoading({ count = 4 }: CommentListLoadingProps) {
    return (
        <>
            {Array.from({ length: count }, (_, index) => index).map((slot) => (
                <CommentSkeleton key={`comment-skeleton-${slot}`} />
            ))}
        </>
    );
}
