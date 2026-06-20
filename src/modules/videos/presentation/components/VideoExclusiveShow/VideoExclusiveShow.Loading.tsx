/**
 * VideoExclusiveShowLoading
 *
 * @description
 * Skeleton placeholder for the exclusive show section, used as the Suspense
 * fallback on the homepage. Mirrors the layout, spacing, and card heights of
 * VideoExclusiveShow.
 */
export function VideoExclusiveShowLoading() {
    return (
        <article className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-112 animate-pulse bg-muted lg:min-h-130 lg:border-r lg:border-border">
                <div className="absolute left-5 top-5 h-6 w-28 rounded-md bg-muted-foreground/10" />

                <div className="absolute inset-x-2 bottom-5 space-y-3 sm:inset-x-3 md:inset-x-6">
                    <div className="h-8 w-3/4 rounded bg-muted-foreground/10" />
                    <div className="mb-6 space-y-2">
                        <div className="h-3.5 w-full rounded bg-muted-foreground/10" />
                        <div className="h-3.5 w-full rounded bg-muted-foreground/10" />
                        <div className="h-3.5 w-4/5 rounded bg-muted-foreground/10" />
                    </div>
                    <div className="h-10 w-full rounded-md bg-muted-foreground/10 sm:w-44" />
                </div>
            </div>

            <div className="p-2 sm:p-3 md:p-6">
                <div className="mb-4 h-4 w-24 rounded bg-muted-foreground/10" />

                <div className="flex flex-col gap-3">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex gap-3 rounded-xl border border-border p-3"
                        >
                            <div className="min-h-18 w-28 shrink-0 animate-pulse self-stretch rounded-md bg-muted sm:w-24 md:w-32 lg:w-20 xl:w-32" />
                            <div className="flex min-w-0 flex-1 flex-col">
                                <div className="h-4 w-3/4 rounded bg-muted-foreground/10" />
                                <div className="mt-1 h-4 w-1/2 rounded bg-muted-foreground/10" />
                                <div className="mt-2 h-3 w-24 rounded bg-muted-foreground/10" />
                                <div className="mt-auto flex items-center justify-between pt-2">
                                    <div className="h-3 w-12 rounded bg-muted-foreground/10" />
                                    <div className="h-3 w-16 rounded bg-muted-foreground/10" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}
