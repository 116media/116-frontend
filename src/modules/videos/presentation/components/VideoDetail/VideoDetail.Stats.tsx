"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useYoutubeStats } from "@/modules/videos/presentation/hooks/useYoutubeStats";
import {
    EyeIcon,
    MessageSquareIcon,
    ShareIcon,
    ThumbsUpIcon
} from "@/shared/presentation/components/ui/Icon";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { formatCount } from "@/shared/presentation/utils/formatCount";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube";

/**
 * One stat chip: an icon plus a compact count, labeled for screen readers.
 *
 * @interface IStatChip
 * @property {string} key - Stable list key.
 * @property {ReactNode} icon - The chip glyph.
 * @property {string} label - Accessible label (`aria-label` / `title`).
 * @property {number | null} count - The value; null hides the chip (hidden ≠ 0).
 */
interface IStatChip {
    key: string;
    icon: ReactNode;
    label: string;
    count: number | null;
}

/**
 * Props for VideoDetail.Stats.
 *
 * @interface VideoDetailStatsProps
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @property {number} shareCount - The backend's own share count (always renders).
 */
export interface VideoDetailStatsProps {
    youtubeVideoUrl: string | null;
    shareCount: number;
}

/**
 * VideoDetail.Stats
 *
 * @description
 * The header's stat-chip strip: YouTube views, likes, and comments from the
 * YouTube Data API (via `useYoutubeStats`), plus the backend's own share
 * count, each an icon + `formatCount` number in muted text. While the YouTube
 * query is in flight three skeleton chips hold the space; a null field (the
 * statistic is hidden or the API is unavailable) drops its chip entirely —
 * null is hidden, not zero. The share chip always renders and is kept live by
 * the share mutation's optimistic bump.
 *
 * @param youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @param shareCount - The backend's own share count.
 */
export function VideoDetailStats({ youtubeVideoUrl, shareCount }: VideoDetailStatsProps) {
    const { t } = useTranslation();
    const youtubeId = extractYoutubeId(youtubeVideoUrl);
    const { data, isLoading } = useYoutubeStats(youtubeId);

    const chips: IStatChip[] = [
        {
            key: "views",
            icon: <EyeIcon className="size-4" />,
            label: t("videos.detail.stats.views"),
            count: data?.viewCount ?? null
        },
        {
            key: "likes",
            icon: <ThumbsUpIcon className="size-4" />,
            label: t("videos.detail.stats.likes"),
            count: data?.likeCount ?? null
        },
        {
            key: "comments",
            icon: <MessageSquareIcon className="size-4" />,
            label: t("videos.detail.stats.comments"),
            count: data?.commentCount ?? null
        },
        {
            key: "shares",
            icon: <ShareIcon className="size-4" />,
            label: t("videos.detail.stats.shares"),
            count: shareCount
        }
    ];

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {youtubeId && isLoading
                ? [0, 1, 2].map((slot) => (
                      <Skeleton
                          key={slot}
                          className="h-4 w-14"
                      />
                  ))
                : null}
            {chips
                .filter((chip) => chip.count !== null)
                .map((chip) => (
                    <span
                        key={chip.key}
                        title={chip.label}
                        className="flex items-center gap-1.5 text-muted-foreground text-sm"
                    >
                        {chip.icon}
                        <span className="sr-only">{chip.label}</span>
                        <span className="tabular-nums">{formatCount(chip.count ?? 0)}</span>
                    </span>
                ))}
        </div>
    );
}
