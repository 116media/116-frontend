"use client";

import { useTranslation } from "react-i18next";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { MegaMenuRow } from "@/shared/presentation/components/ui/MegaMenuRow";
import { SHOWS_PATH, VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import type { VideosMegaMenuCategoryListProps } from "./types";

/**
 * VideosMegaMenuCategoryList
 *
 * @description
 * Left column of the videos mega menu: every video category linking to the videos
 * list filtered by it, between an "all videos" row and an "all shows" row.
 */
export function VideosMegaMenuCategoryList({ categories }: VideosMegaMenuCategoryListProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <p className="mb-3 pr-3 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                {t("videos.home.categories")}
            </p>
            <div className="h-px bg-outlined/60" />

            <MegaMenuRow
                href={VIDEOS_PATH}
                icon={<PlayIcon />}
                label={t("general.all")}
                description={t("videos.home.allDescription")}
            />

            {categories.map((category) => (
                <MegaMenuRow
                    key={category.id}
                    icon={<PlayIcon />}
                    label={category.name}
                    count={category.publishedCount}
                    description={category.description}
                    href={`${VIDEOS_PATH}?categorySlug=${category.slug}`}
                />
            ))}

            <MegaMenuRow
                href={SHOWS_PATH}
                icon={<PlayIcon />}
                label={t("videos.home.showsViewAll")}
                description={t("videos.home.showsViewAllDescription")}
            />
        </div>
    );
}
