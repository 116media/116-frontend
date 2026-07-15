import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * VideoExclusiveShowHeroLoading
 *
 * @description
 * Skeleton placeholder for the hero exclusive show variant, used as the
 * Suspense fallback on the videos page. Mirrors the tag, title, description,
 * CTA row, and episodes rail so the layout does not shift when the data
 * streams in.
 */
export function VideoExclusiveShowHeroLoading() {
    return (
        <section className="overflow-hidden rounded-2xl border bg-card">
            <div className="space-y-4 p-5 sm:p-8 lg:p-10">
                <Skeleton className="h-6 w-28 rounded-md" />

                <Skeleton className="h-12 w-2/3 max-w-3xl sm:h-14" />

                <div className="max-w-2xl space-y-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-4/5" />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Skeleton className="h-10 w-full rounded-md sm:w-44" />
                    <Skeleton className="h-10 w-full rounded-md sm:w-44" />
                </div>

                <div className="pt-6 lg:pt-10">
                    <Skeleton className="h-3 w-20" />
                    <div className="mt-3 flex gap-3 overflow-hidden pb-1">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <div
                                key={index}
                                className="w-56 shrink-0 sm:w-64"
                            >
                                <Skeleton className="aspect-video rounded-lg" />
                                <Skeleton className="mt-2 h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
