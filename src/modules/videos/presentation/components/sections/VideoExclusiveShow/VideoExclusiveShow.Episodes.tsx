"use client";

import { useTranslation } from "react-i18next";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";

/**
 * Props for the VideoExclusiveShowEpisodes component.
 *
 * @interface VideoExclusiveShowEpisodesProps
 * @property {"stack" | "rail"} layout - "stack" renders the vertical list of
 * horizontal cards (split panel); "rail" renders the swipeable scroll-snapped
 * rail of vertical cards (hero).
 */
export interface VideoExclusiveShowEpisodesProps {
    layout: "stack" | "rail";
}

/**
 * EpisodesList
 *
 * @description
 * The layout-specific episode cards: a swipeable scroll-snapped rail of
 * vertical cards, or a vertical stack of horizontal cards.
 */
function EpisodesList({ layout }: VideoExclusiveShowEpisodesProps) {
    const { category } = useExclusiveShow();

    if (layout === "rail") {
        return (
            <div className="scrollbar-hide -m-4 flex snap-x snap-mandatory gap-3 overflow-x-auto p-4 scroll-px-4">
                {category.episodes.map((episode) => (
                    <div
                        key={episode.id}
                        className="w-56 shrink-0 snap-start sm:w-64"
                    >
                        <VideoCard.Vertical video={episode} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {category.episodes.map((episode) => (
                <VideoCard.Horizontal
                    video={episode}
                    key={episode.id}
                />
            ))}
        </div>
    );
}

/**
 * VideoExclusiveShowEpisodes
 *
 * @description
 * The "Episodes" heading and the show's episode cards in the requested layout.
 * suppressHydrationWarning guards the heading because the section streams in
 * after the persisted language.
 */
export function VideoExclusiveShowEpisodes({ layout }: VideoExclusiveShowEpisodesProps) {
    const { t } = useTranslation();
    const { foreground } = useExclusiveShow();

    return (
        <div className={layout === "rail" ? "pt-2" : "p-1 sm:p-3 md:p-6"}>
            <h3
                style={{ color: foreground }}
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                suppressHydrationWarning
            >
                {t("videos.exclusiveShow.episodes")}
            </h3>

            <EpisodesList layout={layout} />
        </div>
    );
}
