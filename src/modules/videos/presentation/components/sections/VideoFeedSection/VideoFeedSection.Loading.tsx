import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * VideoFeedSectionLoading
 *
 * @description
 * Skeleton placeholder for the video feed section, shown while the client-side
 * request resolves. Mirrors the VideoFeedSection layout, built from the shared
 * Skeleton primitive so the shimmer idiom stays consistent.
 */
export function VideoFeedSectionLoading() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <Skeleton className="h-7 w-64 sm:h-8 lg:h-9" />
                <Skeleton className="h-11 w-36 shrink-0 self-start rounded-full sm:h-9.5 sm:self-auto" />
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i}>
                        <Skeleton className="aspect-video w-full rounded-xl" />
                        <div className="mt-3 space-y-2 px-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="mt-1 h-3 w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
