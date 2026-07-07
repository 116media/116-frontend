import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * VideoFeedSectionLoading
 *
 * @description
 * Skeleton placeholder for the video feed section, shown while the client-side
 * request resolves. Mirrors the layout of VideoFeedSection — a heading row
 * (title + "view all" placeholders) above the same responsive grid of eight
 * vertical card placeholders (16:9 thumbnail block + title/meta lines). Built
 * from the shared Skeleton primitive so the shimmer idiom stays consistent.
 */
export function VideoFeedSectionLoading() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-16" />
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
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
