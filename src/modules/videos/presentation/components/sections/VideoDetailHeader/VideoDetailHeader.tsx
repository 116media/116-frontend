"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { VideoDetailScoreboard } from "@/modules/videos/presentation/components/sections/VideoDetailScoreboard";
import { VideoDetailTags } from "@/modules/videos/presentation/components/sections/VideoDetailTags";
import { useYoutubeStats } from "@/modules/videos/presentation/hooks/useYoutubeStats";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    BookmarkIcon,
    EyeIcon,
    ShareIcon,
    StarIcon
} from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube/youtube.utils";

/**
 * Props for VideoDetail.Header.
 *
 * @interface VideoDetailHeaderProps
 * @property {string} title - The video display title.
 * @property {string} categoryName - The category label shown above the title.
 * @property {string | null} publishedAt - ISO publication timestamp, shown beside the category.
 * @property {number} ratingAverage - Cached average star rating.
 * @property {number} ratingCount - Cached total number of ratings.
 * @property {number} shareCount - The backend's own share count.
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @property {IVideoTagEntity[]} tags - The video's tags, rendered at the foot of the card.
 * @property {() => void} onOpenRating - Opens the rating modal (fired by the scoreboard's rating column).
 * @property {() => void} onShare - Opens the share modal.
 * @property {() => void} onAddToPlaylist - Opens the add-to-playlist modal (auth-gated by the caller).
 */
export interface VideoDetailHeaderProps {
    title: string;
    shareCount: number;
    ratingCount: number;
    categoryName: string;
    publishedAt: string | null;
    ratingAverage: number;
    tags: IVideoTagEntity[];
    youtubeVideoUrl: string | null;
    onShare: () => void;
    onOpenRating: () => void;
    onAddToPlaylist: () => void;
}

/**
 * VideoDetail.Header
 *
 * @description
 * The video's identity and action card under the player: category tag with the
 * view count and publication date, title, stats scoreboard, rate / share /
 * add-to-playlist actions, and the tag block. No
 * author is rendered anywhere — a product rule for this page.
 */
export function VideoDetailHeader({
    title,
    categoryName,
    publishedAt,
    ratingAverage,
    ratingCount,
    shareCount,
    youtubeVideoUrl,
    tags,
    onOpenRating,
    onShare,
    onAddToPlaylist
}: VideoDetailHeaderProps) {
    const { t } = useTranslation();
    const { data: youtubeStats } = useYoutubeStats(extractYoutubeId(youtubeVideoUrl));

    return (
        <header className="flex flex-col gap-4 rounded-lg border p-3 md:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Tag
                        as="span"
                        size="lg"
                        variant="primary"
                    >
                        {categoryName}
                    </Tag>
                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                        {youtubeStats?.viewCount != null && (
                            <Fragment>
                                <span className="flex items-center gap-1 tabular-nums">
                                    <EyeIcon className="size-3.5" />
                                    {t("videos.detail.scoreboard.viewsCount", {
                                        value: formatCount(youtubeStats.viewCount)
                                    })}
                                </span>
                                <span aria-hidden="true">·</span>
                            </Fragment>
                        )}
                        <RelativeDate date={publishedAt} />
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onOpenRating}
                        className="h-8 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
                    >
                        <StarIcon className="size-3.5 sm:size-4" />
                        {t("videos.detail.scoreboard.note")}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onShare}
                        className="h-8 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
                    >
                        <ShareIcon className="size-3.5 sm:size-4" />
                        {t("videos.detail.share")}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onAddToPlaylist}
                        title={t("videos.detail.addToPlaylist")}
                        aria-label={t("videos.detail.addToPlaylist")}
                        className="h-8 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
                    >
                        <BookmarkIcon className="size-4 sm:size-5" />
                        {t("videos.detail.save")}
                    </Button>
                </div>
            </div>

            <h1 className="line-clamp-3 font-bold text-lg tracking-tight md:text-2xl">{title}</h1>

            <VideoDetailScoreboard
                shareCount={shareCount}
                ratingCount={ratingCount}
                ratingAverage={ratingAverage}
                onOpenRating={onOpenRating}
                youtubeVideoUrl={youtubeVideoUrl}
            />

            <VideoDetailTags tags={tags} />
        </header>
    );
}
