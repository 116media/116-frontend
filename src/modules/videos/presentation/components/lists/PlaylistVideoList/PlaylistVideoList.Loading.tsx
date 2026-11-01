import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * How many placeholder rows stand in for a playlist's videos.
 */
const PLAYLIST_SKELETON_ROWS = 4;

/**
 * One placeholder row on the horizontal card's footprint: the landscape thumbnail beside
 * the title block, the category tag, the rating line and the footer meta, with the
 * trailing remove action held on the right so the row does not shift when it resolves.
 */
function PlaylistVideoRowSkeleton() {
    return (
        <div className="flex gap-3 rounded-xl border bg-surface-raised/50 p-3">
            <Skeleton className="min-h-18 w-28 shrink-0 self-stretch rounded-md sm:w-24 md:w-32 lg:w-20 xl:w-32" />
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                    <Skeleton className="size-8 shrink-0 self-start rounded-md" />
                </div>
                <Skeleton className="mt-2 h-5 w-20 rounded-md" />
                <Skeleton className="mt-2 h-4 w-24" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

/**
 * Props for PlaylistVideoList.Loading.
 *
 * @interface PlaylistVideoListLoadingProps
 * @property {number} [rows] - How many placeholder rows to render. Defaults to four.
 */
export interface PlaylistVideoListLoadingProps {
    rows?: number;
}

/**
 * PlaylistVideoList.Loading
 *
 * @description
 * Placeholder rows in the list's own column, so the playlist's videos land in the layout
 * their skeletons already occupy.
 */
export function PlaylistVideoListLoading({
    rows = PLAYLIST_SKELETON_ROWS
}: PlaylistVideoListLoadingProps) {
    return (
        <ul className="flex flex-col gap-3">
            {Array.from({ length: rows }, (_, index) => index).map((row) => (
                <li key={`playlist-video-skeleton-${row}`}>
                    <PlaylistVideoRowSkeleton />
                </li>
            ))}
        </ul>
    );
}
