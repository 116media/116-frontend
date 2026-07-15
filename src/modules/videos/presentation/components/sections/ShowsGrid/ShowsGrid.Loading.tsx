import { SHOWS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for ShowsGridLoading.
 *
 * @interface ShowsGridLoadingProps
 * @property {number} [count] - How many tile skeletons to render (default one window).
 */
export interface ShowsGridLoadingProps {
    count?: number;
}

/**
 * ShowsGridLoading
 *
 * @description
 * Skeleton placeholder in the same 1/2/3-column grid and tile height as the
 * real shows grid, so replacing skeletons with poster tiles causes no layout
 * shift.
 */
export function ShowsGridLoading({ count = SHOWS_PAGE_SIZE }: ShowsGridLoadingProps) {
    const slots = Array.from({ length: count }, (_, index) => index);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot) => (
                <Skeleton
                    key={slot}
                    className="aspect-[4/5] rounded-xl"
                />
            ))}
        </div>
    );
}
