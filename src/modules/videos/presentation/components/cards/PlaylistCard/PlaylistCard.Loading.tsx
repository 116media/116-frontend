import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";
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
        <FavoriteCard>
            <div className="grid grid-cols-2 gap-px bg-border">
                {slots.map((slot) => (
                    <Skeleton
                        key={slot}
                        className="aspect-video rounded-none"
                    />
                ))}
            </div>

            <FavoriteCard.Body>
                <div className="min-h-[2lh]">
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <FavoriteCard.Actions className="gap-2 border-border dark:border-foreground/10">
                    <Skeleton className="h-7 w-14 rounded-md" />
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="ml-auto size-7 rounded-md" />
                </FavoriteCard.Actions>
            </FavoriteCard.Body>
        </FavoriteCard>
    );
}
