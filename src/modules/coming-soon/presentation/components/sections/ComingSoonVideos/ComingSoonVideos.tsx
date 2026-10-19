"use client";

import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { useVideosFeed } from "@/modules/videos/presentation/hooks/useVideosFeed";
import { FeedHeading } from "@/shared/presentation/components/ui/FeedHeading";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

import { ComingSoonVideosLoading } from "./ComingSoonVideos.Loading";

/**
 * How many of the latest videos the strip shows: one row of four on a desktop, two rows
 * of two below it, so the section never outgrows the page it is tempting a reader off.
 */
const STRIP_SIZE = 4;

/**
 * The column ladder, two across from the smallest screen so the covers stay large enough
 * to read as something worth tapping.
 */
const VIDEO_GRID = "grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4";

/**
 * ComingSoonVideos
 *
 * @description
 * The latest videos, offered to a reader who arrived at a surface that is not open yet.
 * Renders nothing on failure or an empty catalog: it is somewhere to go, not something
 * the page owes, so a quiet absence beats an error beside a feature announcement.
 */
export function ComingSoonVideos() {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useVideosFeed();

    const videos = (data?.pages[0]?.items ?? []).slice(0, STRIP_SIZE);

    return (
        <section className="flex flex-col gap-6">
            <FeedHeading
                actionHref={VIDEOS_PATH}
                title={t("comingSoon.feature.videos.title")}
                subtitle={t("comingSoon.feature.videos.subtitle")}
                actionLabel={t("comingSoon.feature.videos.all")}
            />

            <StateRenderer
                data={videos}
                error={isError}
                loading={isLoading}
                skeleton={
                    <div className={VIDEO_GRID}>
                        <ComingSoonVideosLoading count={STRIP_SIZE} />
                    </div>
                }
                render={(items) => (
                    <div className={VIDEO_GRID}>
                        {items.map((video) => (
                            <VideoCard.Vertical
                                key={video.id}
                                video={video}
                            />
                        ))}
                    </div>
                )}
            />
        </section>
    );
}
