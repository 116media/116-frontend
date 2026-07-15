import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";

/**
 * Props for ShowsGrid.
 *
 * @interface ShowsGridProps
 * @property {IShowEntity[]} shows - The shows to render as grid tiles.
 */
export interface ShowsGridProps {
    shows: IShowEntity[];
}

/**
 * ShowsGrid
 *
 * @description
 * The responsive grid of vertical show tiles for the shows page (1/2/3 columns
 * by breakpoint). Purely presentational; the container owns data and paging.
 */
export function ShowsGrid({ shows }: ShowsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
                <ShowCard.Vertical
                    key={show.id}
                    show={show}
                />
            ))}
        </div>
    );
}
