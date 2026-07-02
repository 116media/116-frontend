"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ListPlusIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";

import { VideoDetailRating } from "./VideoDetail.Rating";
import { VideoDetailStats } from "./VideoDetail.Stats";

/**
 * Props for VideoDetail.Header.
 *
 * @interface VideoDetailHeaderProps
 * @property {string} videoId - The video's id, for the rating mutation.
 * @property {string} slug - The video slug keying the cached detail entity.
 * @property {string} title - The video display title.
 * @property {string} categoryName - The category label shown above the title.
 * @property {number} ratingAverage - Cached average star rating.
 * @property {number} ratingCount - Cached total number of ratings.
 * @property {number} shareCount - The backend's own share count.
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @property {() => void} onShare - Opens the share modal.
 * @property {() => void} onAddToPlaylist - Opens the add-to-playlist modal (auth-gated by the caller).
 */
export interface VideoDetailHeaderProps {
    videoId: string;
    slug: string;
    title: string;
    categoryName: string;
    ratingAverage: number;
    ratingCount: number;
    shareCount: number;
    youtubeVideoUrl: string | null;
    onShare: () => void;
    onAddToPlaylist: () => void;
}

/**
 * VideoDetail.Header
 *
 * @description
 * The video's identity and action strip, directly under the player: the
 * category `Tag`, the serif editorial `h1` (clamped at three lines), the meta
 * row (rating display + submit stars, YouTube stat chips, share count), and
 * the action row (share and add-to-playlist outline buttons). No author is
 * rendered anywhere — a product rule for this page. Everything wraps cleanly
 * at mobile widths.
 *
 * @param videoId - The video's id, for the rating mutation.
 * @param slug - The video slug keying the cached detail entity.
 * @param title - The video display title.
 * @param categoryName - The category label shown above the title.
 * @param ratingAverage - Cached average star rating.
 * @param ratingCount - Cached total number of ratings.
 * @param shareCount - The backend's own share count.
 * @param youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @param onShare - Opens the share modal.
 * @param onAddToPlaylist - Opens the add-to-playlist modal.
 */
export function VideoDetailHeader({
    videoId,
    slug,
    title,
    categoryName,
    ratingAverage,
    ratingCount,
    shareCount,
    youtubeVideoUrl,
    onShare,
    onAddToPlaylist
}: VideoDetailHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="flex flex-col gap-3">
            <div>
                <Tag
                    as="span"
                    size="sm"
                    variant="primary"
                >
                    {categoryName}
                </Tag>
            </div>

            <h1 className="line-clamp-3 font-bold text-2xl tracking-tight md:text-3xl">{title}</h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <VideoDetailRating
                    slug={slug}
                    videoId={videoId}
                    ratingCount={ratingCount}
                    ratingAverage={ratingAverage}
                />
                <VideoDetailStats
                    shareCount={shareCount}
                    youtubeVideoUrl={youtubeVideoUrl}
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onShare}
                    className="gap-1.5"
                >
                    <ShareIcon className="size-4" />
                    {t("videos.detail.share")}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddToPlaylist}
                    className="gap-1.5"
                >
                    <ListPlusIcon className="size-4" />
                    {t("videos.detail.addToPlaylist")}
                </Button>
            </div>
        </header>
    );
}
