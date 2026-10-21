"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";
import { Md3Carousel } from "@/shared/presentation/components/ui/Md3Carousel";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { useMediaQuery } from "@/shared/presentation/hooks/useMediaQuery";

/**
 * Below this width the strip runs the Material 3 *hero* layout: one focal card with a
 * small keyline card at each edge. Above it, the multi-browse layout with three focal
 * cards has room to read.
 */
const HERO_LAYOUT_QUERY = "(max-width: 767px)";

/**
 * Slot widths per layout. Each set fills the track once its gaps are subtracted.
 */
const LAYOUT = {
    hero: {
        heroCount: 1,
        heroClassName: "w-[calc((100%_-_16px)_*_0.715)]",
        childClassName: "w-[calc((100%_-_16px)_*_0.1425)]"
    },
    multiBrowse: {
        heroCount: 3,
        heroClassName: "w-[calc((100%_-_32px)_*_0.2917)]",
        childClassName: "w-[calc((100%_-_32px)_*_0.0625)]"
    }
} as const;

/**
 * Props for the ShowsCarousel component.
 *
 * @interface ShowsCarouselProps
 * @property {IShowEntity[]} shows - Shows rendered in the carousel.
 */
export interface ShowsCarouselProps {
    shows: IShowEntity[];
}

/**
 * ShowsCarousel
 *
 * @description
 * Shows configuration of the shared MD3 hero carousel: renders each show with
 * `ShowCard.Poster` (captioned when focal) and opens the show's page when its hero card is clicked.
 */
export function ShowsCarousel({ shows }: ShowsCarouselProps) {
    const router = useRouter();
    const isHeroLayout = useMediaQuery(HERO_LAYOUT_QUERY);
    const layout = isHeroLayout ? LAYOUT.hero : LAYOUT.multiBrowse;

    return (
        <Md3Carousel
            items={shows}
            ariaLabel="Shows"
            visibleChildren={2}
            centerHero={isHeroLayout}
            getKey={(show) => show.id}
            heroCount={layout.heroCount}
            heroClassName={layout.heroClassName}
            childClassName={layout.childClassName}
            heightClassName="h-72 sm:h-80 lg:h-120"
            onHeroActivate={(show) => router.push(`${VIDEOS_PATH}/${show.slug}`)}
            renderItem={(show, { isHero }) => (
                <Fragment>
                    <ShowCard.Poster show={show} />
                    {isHero && (
                        <ShowCard.Caption
                            show={show}
                            size="lg"
                        />
                    )}
                </Fragment>
            )}
        />
    );
}
