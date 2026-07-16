import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * PlaylistCardLoading
 *
 * @description
 * Skeleton placeholder for {@link PlaylistCard}, mirroring the 2x2 cover collage, title,
 * and inline action row so swapping in real cards causes no layout shift.
 */
export function PlaylistCardLoading() {
    const slots = [0, 1, 2, 3];

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border bg-card">
            <div className="grid grid-cols-2 gap-px bg-border">
                {slots.map((slot) => (
                    <Skeleton
                        key={slot}
                        className="aspect-video rounded-none"
                    />
                ))}
            </div>
            <div className="flex flex-1 flex-col p-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-2 flex items-center gap-2 border-t pt-2">
                    <Skeleton className="h-7 w-14 rounded-md" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="ml-auto size-7 rounded-md" />
                </div>
            </div>
        </article>
    );
}
