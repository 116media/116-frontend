import Link from "next/link";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";
import { Caption } from "./ShowCard.Caption";
import { Poster } from "./ShowCard.Poster";

/**
 * Props for the Vertical show card variant.
 *
 * @interface ShowCardVerticalProps
 * @property {IShowEntity} show - The show rendered as a grid tile.
 */
export interface ShowCardVerticalProps {
    show: IShowEntity;
}

/**
 * Vertical
 *
 * @description
 * Grid-tile show card for the shows page: the poster content in a 4:5 portrait
 * linked tile, with the hero overlay (title, description, and hover-revealed
 * watch CTA) always on. Links to the show's page.
 */
export function Vertical({ show }: ShowCardVerticalProps) {
    return (
        <Link
            href={`${SHOWS_PATH}/${show.slug}`}
            className="group relative block aspect-4/5 overflow-hidden rounded-xl"
        >
            <Poster show={show} />
            <Caption
                size="lg"
                show={show}
            />
        </Link>
    );
}
