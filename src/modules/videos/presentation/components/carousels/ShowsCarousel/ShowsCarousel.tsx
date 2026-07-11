"use client";

import { useRouter } from "next/navigation";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";
import { Md3Carousel } from "@/shared/presentation/components/ui/Md3Carousel";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

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
 * `ShowCard` and opens the show's page when its hero card is clicked.
 */
export function ShowsCarousel({ shows }: ShowsCarouselProps) {
    const router = useRouter();

    return (
        <Md3Carousel
            items={shows}
            ariaLabel="Shows"
            heroCount={3}
            visibleChildren={2}
            getKey={(show) => show.id}
            heightClassName="h-72 sm:h-80 lg:h-96"
            onHeroActivate={(show) => router.push(`${VIDEOS_PATH}/${show.slug}`)}
            renderItem={(show, { isHero }) => (
                <ShowCard
                    show={show}
                    isHero={isHero}
                />
            )}
        />
    );
}
