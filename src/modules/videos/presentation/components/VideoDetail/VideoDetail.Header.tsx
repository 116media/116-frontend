"use client";

import { useTranslation } from "react-i18next";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { BookmarkIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { VideoDetailScoreboard } from "./VideoDetail.Scoreboard";
import { VideoDetailTags } from "./VideoDetail.Tags";

/**
 * Props for VideoDetail.Header.
 *
 * @interface VideoDetailHeaderProps
 * @property {string} title - The video display title.
 * @property {string} categoryName - The category label shown above the title.
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
 * The video's identity and action card, directly under the player: a bordered,
 * padded surface (no shadow) holding the category `Tag`, the `h1` (clamped at
 * three lines), the stats scoreboard (rating / YouTube views + comments /
 * YouTube likes + shares — the rating column opens the rating modal), the
 * action row (a prominent share button with the add-to-playlist button tucked
 * in the corner), and the tag block at the foot. No author is rendered anywhere
 * — a product rule for this page. Everything wraps cleanly at mobile widths.
 *
 * @param title - The video display title.
 * @param categoryName - The category label shown above the title.
 * @param ratingAverage - Cached average star rating.
 * @param ratingCount - Cached total number of ratings.
 * @param shareCount - The backend's own share count.
 * @param youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @param tags - The video's tags, rendered at the foot of the card.
 * @param onOpenRating - Opens the rating modal.
 * @param onShare - Opens the share modal.
 * @param onAddToPlaylist - Opens the add-to-playlist modal.
 */
export function VideoDetailHeader({
    title,
    categoryName,
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

    return (
        <header className="flex flex-col gap-4 rounded-lg border p-3 md:p-4">
            <div className="flex items-center justify-between">
                <Tag
                    as="span"
                    size="lg"
                    variant="primary"
                >
                    {categoryName}
                </Tag>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onShare}
                        className="gap-1.5"
                    >
                        <ShareIcon className="size-4" />
                        {t("videos.detail.share")}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onAddToPlaylist}
                        title={t("videos.detail.addToPlaylist")}
                        aria-label={t("videos.detail.addToPlaylist")}
                    >
                        <BookmarkIcon className="size-5" />
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
