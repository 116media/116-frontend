"use client";

import { useTranslation } from "react-i18next";

import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";

export interface VideoExclusiveShowEpisodesProps {
    episodes: IVideoSummaryEntity[];
}

/**
 * VideoExclusiveShowEpisodes
 *
 * @description
 * Right panel of the exclusive show section — the "Episodes" heading and the
 * vertical stack of horizontal episode cards. suppressHydrationWarning guards
 * the heading because the section streams in after the persisted language.
 *
 * @param episodes - The show's episodes
 */
export function VideoExclusiveShowEpisodes({ episodes }: VideoExclusiveShowEpisodesProps) {
    const { t } = useTranslation();

    return (
        <div className="p-2 sm:p-3 md:p-6">
            <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground"
                suppressHydrationWarning
            >
                {t("videos.exclusiveShow.episodes")}
            </h3>

            <div className="flex flex-col gap-3">
                {episodes.map((episode) => (
                    <VideoCard.Horizontal
                        video={episode}
                        key={episode.id}
                    />
                ))}
            </div>
        </div>
    );
}
