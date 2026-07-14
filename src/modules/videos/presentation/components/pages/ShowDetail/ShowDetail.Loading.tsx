import { VideosGridLoading } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Loading";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Description lines rendered in the hero panel skeleton.
 */
const DESCRIPTION_LINES = [0, 1, 2];

/**
 * ShowDetailLoading
 *
 * @description
 * Full-page skeleton for the show detail route, mirroring the split hero and
 * the episodes grid of the resolved {@link ShowDetailContainer}. Built from
 * the shared `Skeleton` primitive so the layout does not shift on load.
 */
export function ShowDetailLoading() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border p-4 sm:p-12 lg:h-120 lg:grid-cols-2 lg:gap-6">
                <div className="flex aspect-video items-center justify-center lg:aspect-auto">
                    <Skeleton className="h-48 w-full max-w-md rounded-lg sm:h-56 lg:h-64" />
                </div>

                <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-12">
                    <Skeleton className="h-8 w-3/4 sm:h-10" />
                    <div className="space-y-2">
                        {DESCRIPTION_LINES.map((line) => (
                            <Skeleton
                                key={line}
                                className={
                                    line === DESCRIPTION_LINES.length - 1
                                        ? "h-4 w-4/5"
                                        : "h-4 w-full"
                                }
                            />
                        ))}
                    </div>
                    <Skeleton className="h-11 w-44 rounded-md" />
                </div>
            </div>

            <section className="flex flex-col gap-6">
                <Skeleton className="h-7 w-40 sm:h-8" />
                <VideosGridLoading />
            </section>
        </div>
    );
}
