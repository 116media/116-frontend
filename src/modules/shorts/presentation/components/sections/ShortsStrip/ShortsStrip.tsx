import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortCard } from "@/modules/shorts/presentation/components/cards/ShortCard";

const STRIP_TILE_LIMIT = 15;

/**
 * Props for the ShortsStrip component.
 *
 * @interface ShortsStripProps
 * @property {IShortVideoEntity[]} shorts - The full feed slice (the strip shows a prefix).
 * @property {(index: number) => void} onOpen - Opens the player at the tapped index.
 */
export interface ShortsStripProps {
    shorts: IShortVideoEntity[];
    onOpen: (index: number) => void;
}

/**
 * ShortsStrip
 *
 * @description
 * Horizontally scroll-snapping row of short tiles — a capped teaser prefix of the
 * feed. Simple overflow scroll with snap points, no arrows, dots, or carousel motion.
 */
export function ShortsStrip({ shorts, onOpen }: ShortsStripProps) {
    return (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {shorts.slice(0, STRIP_TILE_LIMIT).map((short, index) => (
                <ShortCard
                    short={short}
                    key={short.id}
                    onOpen={() => onOpen(index)}
                    className="w-36 shrink-0 snap-start sm:w-40 cursor-pointer"
                />
            ))}
        </div>
    );
}
