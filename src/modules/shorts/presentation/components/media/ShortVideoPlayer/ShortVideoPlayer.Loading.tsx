import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * ShortVideoPlayerLoading
 *
 * @description
 * Skeleton overlay for the shorts player, shown until the clip can play. Mirrors the
 * réel chrome — a 9:16 frame, a centered play placeholder, and a bottom control bar
 * (play toggle · progress · time) — so the layout never shifts when the video takes
 * over. Pointer-transparent so a ready player underneath stays interactive.
 */
export function ShortVideoPlayerLoading() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <Skeleton className="absolute inset-0 size-full rounded-xl" />

            <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="size-16 rounded-full bg-white/20" />
            </div>

            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
                <Skeleton className="size-6 shrink-0 rounded-full bg-white/20" />
                <Skeleton className="h-1 flex-1 rounded-full bg-white/20" />
                <Skeleton className="h-3 w-10 shrink-0 bg-white/20" />
            </div>
        </div>
    );
}
