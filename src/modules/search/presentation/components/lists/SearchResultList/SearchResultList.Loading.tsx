import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SEARCH_GRIDS } from "@/modules/search/presentation/constants/searchLayout";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * How many placeholders fill a group. A panel previews a handful of hits, so a page-sized
 * run of them would overflow the panel before the results it stands in for arrive.
 */
const DENSITIES = {
    preview: { wide: 3, tall: 4 },
    page: { wide: 6, tall: 8 }
} as const;

/**
 * The heading box's geometry, mirroring SectionHeader at the size the results use, so the
 * placeholder occupies the row the real heading lands in.
 */
const HEADING = { box: "gap-3 p-2", well: "size-9" };

/**
 * How densely to fill a group.
 */
export type SearchLoadingDensity = keyof typeof DENSITIES;

/**
 * Props for the SearchResultList.Loading component.
 *
 * @interface SearchResultListLoadingProps
 * @property {ESearchScope} scope - The scope being searched, which decides how many groups
 * stand in and which card shape each one uses.
 * @property {SearchLoadingDensity} [density] - How many placeholders fill a group.
 */
export interface SearchResultListLoadingProps {
    scope: ESearchScope;
    density?: SearchLoadingDensity;
}

/**
 * The boxed heading that stands in for a group's SectionHeader.
 */
function HeadingPlaceholder() {
    return (
        <div className={cn("flex items-center rounded-lg bg-muted/40", HEADING.box)}>
            <Skeleton className={cn("shrink-0 rounded-md", HEADING.well)} />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2 w-20" />
            </div>
        </div>
    );
}

/**
 * One group of placeholders: the heading box over the type's own column ladder. `wide`
 * cards carry a 16:9 cover and a meta row; `tall` cards are a bare 9:16 poster.
 */
function GroupPlaceholder({ shape, count }: { shape: "wide" | "tall"; count: number }) {
    const keys = Array.from({ length: count }, (_, index) => `${shape}-${index}`);

    return (
        <section className="flex flex-col gap-4">
            <HeadingPlaceholder />
            <div className={SEARCH_GRIDS[shape]}>
                {keys.map((key) =>
                    shape === "wide" ? (
                        <div
                            key={key}
                            className="flex flex-col gap-3"
                        >
                            <Skeleton className="aspect-video w-full rounded-xl" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    ) : (
                        <div
                            key={key}
                            className="flex flex-col gap-2"
                        >
                            <Skeleton className="aspect-[9/16] w-full rounded-xl" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    )
                )}
            </div>
        </section>
    );
}

/**
 * Which shapes stand in for a scope. Searching everything can return any type, so it
 * shows both ladders; a single scope shows only its own.
 */
const SHAPES: Record<ESearchScope, Array<"wide" | "tall">> = {
    [ESearchScope.All]: ["wide", "tall"],
    [ESearchScope.Articles]: ["wide"],
    [ESearchScope.Videos]: ["wide"],
    [ESearchScope.Shorts]: ["tall"]
};

/**
 * SearchResultList.Loading
 *
 * @description
 * Placeholders in the grouped shape the results land in — a boxed heading over each
 * type's own column ladder — so the layout holds instead of reflowing when they arrive.
 */
export function SearchResultListLoading({ scope, density = "page" }: SearchResultListLoadingProps) {
    const sizes = DENSITIES[density];

    return (
        <div
            aria-busy
            className="flex flex-col gap-12"
        >
            {SHAPES[scope].map((shape) => (
                <GroupPlaceholder
                    key={shape}
                    shape={shape}
                    count={sizes[shape]}
                />
            ))}
        </div>
    );
}
