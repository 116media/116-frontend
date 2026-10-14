"use client";

import { useTranslation } from "react-i18next";

import { VideosMegaMenuCard } from "@/modules/videos/presentation/components/cards/VideosMegaMenuCard";
import { DUMMY_VIDEOS } from "@/modules/videos/presentation/data/mega-menu.dummy";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { SHOWS_PATH, VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import {
    MobileMegaMenuFeatured,
    MobileMegaMenuSection,
    MobileMegaMenuTags
} from "@/shared/presentation/layouts/MobileMegaMenu";

import type { VideosMobileMenuProps } from "./types";

/**
 * VideosMobileMenu
 *
 * @description
 * The VIDÉOS panel of the mobile menu: every video category with its published
 * count between the all-videos and all-shows rows, the promoted cards and the
 * popular tags. Mirrors VideosMegaMenu with the three columns stacked.
 */
export function VideosMobileMenu({
    categories,
    promotedVideos,
    popularTags,
    onNavigate
}: VideosMobileMenuProps) {
    const { t } = useTranslation();

    const cards = promotedVideos.length > 0 ? promotedVideos.slice(0, 4) : DUMMY_VIDEOS;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <div className="flex flex-col pb-4">
            <MobileMegaMenuSection title={t("videos.home.categories")}>
                <div className="flex flex-col">
                    <MegaMenuRow
                        href={VIDEOS_PATH}
                        onNavigate={onNavigate}
                        label={t("general.all")}
                    />
                    {categories.map((category) => (
                        <MegaMenuRow
                            key={category.id}
                            label={category.name}
                            onNavigate={onNavigate}
                            count={category.publishedCount}
                            href={`${VIDEOS_PATH}?categoryId=${category.id}`}
                        />
                    ))}
                    <MegaMenuRow
                        href={SHOWS_PATH}
                        onNavigate={onNavigate}
                        label={t("videos.home.showsViewAll")}
                    />
                </div>
            </MobileMegaMenuSection>

            <MobileMegaMenuFeatured
                variant="plain"
                onNavigate={onNavigate}
                viewAllHref={VIDEOS_PATH}
            >
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 grid-rows-[200px] gap-3">
                        {featured[0] && (
                            <VideosMegaMenuCard.FeaturedFullBleed video={featured[0]} />
                        )}
                        {featured[1] && (
                            <VideosMegaMenuCard.FeaturedSpotlight video={featured[1]} />
                        )}
                    </div>
                    {compact.length > 0 && (
                        <div className="grid grid-cols-2 grid-rows-[150px] gap-3">
                            {compact.map((video) => (
                                <VideosMegaMenuCard.Compact
                                    key={video.id}
                                    video={video}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </MobileMegaMenuFeatured>

            <MobileMegaMenuTags
                tags={popularTags}
                onNavigate={onNavigate}
                basePath={VIDEOS_PATH}
            />
        </div>
    );
}
