"use client";

import { useTranslation } from "react-i18next";

import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { mostRecentEpisode } from "@/modules/videos/presentation/utils/episodes/episodes.utils";
import { ListVideoIcon, StarIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * VideoExclusiveShow.Meta
 *
 * @description
 * Scale and freshness line for the show card: how many episodes the show holds, the
 * average rating across the loaded episodes, and when the newest one landed.
 */
export function VideoExclusiveShowMeta() {
    const { t } = useTranslation();
    const { category, foreground } = useExclusiveShow();

    const rated = category.episodes.filter((episode) => episode.ratingCount > 0);
    const rating = rated.length
        ? rated.reduce((sum, episode) => sum + episode.ratingAverage, 0) / rated.length
        : null;
    const latest = mostRecentEpisode(category.episodes);

    // The category counter can lag behind what the episode page already proves exists.
    const episodeCount = Math.max(category.episodeCount, category.episodes.length);

    return (
        <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
            style={{ color: withAlpha(foreground, 0.75) }}
        >
            <span className="flex items-center gap-1.5">
                <ListVideoIcon className="size-4" />
                <span suppressHydrationWarning>
                    {t("videos.exclusiveShow.episodeCount", { count: episodeCount })}
                </span>
            </span>

            {rating !== null && (
                <span className="flex items-center gap-1.5">
                    <StarIcon className="size-4 fill-current" />
                    <span className="tabular-nums">{rating.toFixed(1)}</span>
                </span>
            )}

            {latest?.publishedAt && (
                <span className="flex items-center gap-1.5">
                    <span suppressHydrationWarning>{t("videos.exclusiveShow.updated")}</span>
                    <RelativeDate date={latest.publishedAt} />
                </span>
            )}
        </div>
    );
}
