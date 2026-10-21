"use client";

import { useTranslation } from "react-i18next";

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
                label={t("general.all")}
            />

            {categories.map((category) => (
                <MegaMenuRow
                    key={category.id}
                    label={category.name}
                    count={category.publishedCount}
                    href={`${VIDEOS_PATH}?categoryId=${category.id}`}
                />
            ))}

            <MegaMenuRow
                href={SHOWS_PATH}
                label={t("videos.home.showsViewAll")}
            />
        </div>
    );
}
