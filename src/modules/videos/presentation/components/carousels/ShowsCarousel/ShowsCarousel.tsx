"use client";

import { Fragment } from "react";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";
import { Md3Carousel } from "@/shared/presentation/components/ui/Md3Carousel";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { useMediaQuery } from "@/shared/presentation/hooks/useMediaQuery";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";

/**
 * Below this width the strip runs the Material 3 *hero* layout: one focal card holding the
 * width, with a single keyline card peeking at the trailing edge. Above it, the
 * multi-browse layout with three focal cards has room to read.
 */
const HERO_LAYOUT_QUERY = "(max-width: 767px)";

/**
 * Tablet widths run two focal cards rather than three: the same strip at three would hand
 * each show roughly a phone's worth of width. The second clause catches a tablet held in
 * landscape, where the viewport matches a laptop and only the coarse pointer separates them.
 */
const PAIR_LAYOUT_QUERY =
    "(min-width: 768px) and (max-width: 1279px), (min-width: 768px) and (max-width: 1535px) and (pointer: coarse)";

/**
 * How long a show holds the focal slot before the strip advances on its own. Long enough
 * to read the title and the opening of the synopsis.
 */
const AUTOPLAY_DURATION_MS = 6000;

/**
 * Slot widths per layout. Each set fills the track once its gaps are subtracted.
 */
const LAYOUT = {
    hero: {
        heroCount: 1,
        visibleChildren: 1,
        centerHero: false,
        heroClassName: "w-[calc((100%_-_8px)_*_0.85)]",
        childClassName: "w-[calc((100%_-_8px)_*_0.15)]"
    },
    pair: {
        heroCount: 2,
        visibleChildren: 1,
        centerHero: false,
        heroClassName: "w-[calc((100%_-_16px)_*_0.45)]",
        childClassName: "w-[calc((100%_-_16px)_*_0.1)]"
    },
    multiBrowse: {
        heroCount: 3,
        visibleChildren: 2,
        centerHero: false,
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
 * Shows configuration of the shared MD3 carousel: renders each show with `ShowCard.Poster`
 * (captioned when focal) and opens the show's page when its hero card is clicked. A phone
 * gets one wide card plus a peek of the next, with room for the caption's call to action.
 * The strip advances on its own, so the section shows more than the first show at a glance.
 */
export function ShowsCarousel({ shows }: ShowsCarouselProps) {
    const router = useProgressRouter();
    const isHeroLayout = useMediaQuery(HERO_LAYOUT_QUERY);
    const isPairLayout = useMediaQuery(PAIR_LAYOUT_QUERY);
    const layout = isHeroLayout ? LAYOUT.hero : isPairLayout ? LAYOUT.pair : LAYOUT.multiBrowse;

    return (
        <Md3Carousel
            items={shows}
            ariaLabel="Shows"
            getKey={(show) => show.id}
            heroCount={layout.heroCount}
            centerHero={layout.centerHero}
            heroClassName={layout.heroClassName}
            childClassName={layout.childClassName}
            visibleChildren={layout.visibleChildren}
            heightClassName="h-96 md:h-96 lg:h-120"
            autoplay
            duration={AUTOPLAY_DURATION_MS}
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
