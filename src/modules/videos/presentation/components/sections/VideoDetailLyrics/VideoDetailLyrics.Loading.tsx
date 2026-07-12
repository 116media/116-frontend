import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * VideoDetailLyrics.Loading
 *
 * @description
 * Skeleton for the lyrics tab panel: a title and artist line followed by stanza-shaped
 * lines, matching the loaded layout so the swap causes no shift.
 */
export function VideoDetailLyricsLoading() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-32" />
            {[0, 1, 2, 3, 4, 5].map((line) => (
                <Skeleton
                    key={line}
                    className={line % 4 === 3 ? "mt-3 h-4 w-1/2" : "h-4 w-2/3"}
                />
            ))}
        </div>
    );
}
