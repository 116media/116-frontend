import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Slot widths mirroring the shows carousel: below `md` one focal card centred between two
 * keylines, above it three focal cards followed by the two keylines.
 */
const HERO_SLOT = "w-[calc((100%_-_16px)_*_0.62)]";
const CHILD_SLOT = "w-[calc((100%_-_16px)_*_0.19)]";
const HERO_SLOT_MD = "w-[calc((100%_-_32px)_*_0.2917)]";
const CHILD_SLOT_MD = "w-[calc((100%_-_32px)_*_0.0625)]";

/**
 * ShowsSectionLoading
 *
 * @description
 * Skeleton placeholder for the shows section, shown while the client-side request
 * resolves. Mirrors the heading row and the carousel's slot order, widths and height, so
 * the section does not jump when the shows arrive.
 */
export function ShowsSectionLoading() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
                <Skeleton className="h-7 w-64 sm:h-8 lg:h-9 lg:w-96" />
                <Skeleton className="h-4 w-28 shrink-0" />
            </div>

            <div className="px-1">
                <div className="flex h-72 w-full items-stretch overflow-hidden sm:h-80 md:hidden">
                    <Skeleton className={`h-full shrink-0 rounded-2xl ${CHILD_SLOT}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${HERO_SLOT}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${CHILD_SLOT}`} />
                </div>

                <div className="hidden h-80 w-full items-stretch overflow-hidden md:flex lg:h-120">
                    <Skeleton className={`h-full shrink-0 rounded-2xl ${HERO_SLOT_MD}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${HERO_SLOT_MD}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${HERO_SLOT_MD}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${CHILD_SLOT_MD}`} />
                    <Skeleton className={`ml-2 h-full shrink-0 rounded-2xl ${CHILD_SLOT_MD}`} />
                </div>
            </div>
        </section>
    );
}
