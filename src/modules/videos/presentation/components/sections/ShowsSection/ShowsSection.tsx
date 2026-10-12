"use client";

import { useTranslation } from "react-i18next";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowsCarousel } from "@/modules/videos/presentation/components/carousels/ShowsCarousel";
import { FeedHeading } from "@/shared/presentation/components/ui/FeedHeading";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for the ShowsSection component.
 *
 * @interface ShowsSectionProps
 * @property {IShowEntity[]} shows - Shows rendered in the section.
 */
export interface ShowsSectionProps {
    shows: IShowEntity[];
}

/**
 * ShowsSection
 *
 * @description
 * Homepage "shows" section: the shared heading row linking to the shows page,
 * above the swipeable focal carousel of shows.
 */
export function ShowsSection({ shows }: ShowsSectionProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <FeedHeading
                title={t("videos.home.showsTitle")}
                actionHref={SHOWS_PATH}
                actionLabel={t("videos.home.showsViewAll")}
            />

            <ShowsCarousel shows={shows} />
        </section>
    );
}
