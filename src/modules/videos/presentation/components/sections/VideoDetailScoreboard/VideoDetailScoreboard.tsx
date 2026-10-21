"use client";

import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useYoutubeStats } from "@/modules/videos/presentation/hooks/useYoutubeStats";
import {
    EyeIcon,
    StarIcon,
    ThumbsUpIcon,
    YoutubeIcon
} from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { STAR_POSITIONS } from "@/shared/presentation/constants/rating";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube/youtube.utils";

/**
 * Props for VideoDetail.Scoreboard.
 *
 * @interface VideoDetailScoreboardProps
 * @property {number} ratingAverage - Cached average star rating (1–5).
 * @property {number} ratingCount - Cached total number of ratings.
 * @property {number} shareCount - The backend's own share count.
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @property {() => void} onOpenRating - Opens the rating modal (fired by the rating column).
 */
export interface VideoDetailScoreboardProps {
    ratingAverage: number;
    ratingCount: number;
    shareCount: number;
    youtubeVideoUrl: string | null;
    onOpenRating: () => void;
}

/**
 * ScoreboardColumn
 *
 * @description
 * One column of the scoreboard: icon+label header, large primary value,
 * optional middle slot, and a muted secondary line. Renders as a button when
 * `onClick` is supplied so the whole column is the rating affordance.
 *
 * @param icon - The header glyph.
 * @param label - The uppercase column label.
 * @param value - The large primary value node (number, skeleton, or dash).
 * @param middle - Optional node between the value and the secondary line.
 * @param secondary - The muted secondary line.
 * @param onClick - When set, renders the column as a button with this handler.
 * @param ariaLabel - Accessible label for the button form.
 */
function ScoreboardColumn({
    icon,
    label,
    value,
    middle,
    secondary,
    onClick,
    ariaLabel
}: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
    middle?: ReactNode;
    secondary: ReactNode;
    onClick?: () => void;
    ariaLabel?: string;
}) {
    const inner = (
        <Fragment>
            <span className="flex items-center gap-1 font-semibold text-[9px] text-muted-foreground uppercase tracking-wider sm:gap-1.5 sm:text-[10px]">
                {icon}
                {label}
            </span>
            <span className="font-bold text-lg text-foreground tabular-nums sm:text-2xl md:text-3xl">
                {value}
            </span>
            {middle}
            <span className="text-balance text-[11px] text-muted-foreground leading-tight sm:text-xs">
                {secondary}
            </span>
        </Fragment>
    );

    const layout =
        "flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-center sm:gap-1.5 sm:px-2";

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className="flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl p-1.5 hover:bg-accent/40 sm:gap-1.5 sm:p-2"
            >
                {inner}
            </button>
        );
    }

    return <div className={layout}>{inner}</div>;
}

/**
 * VideoDetail.Scoreboard
 *
 * @description
 * The video's headline stats board, split into three columns: rating (opens the rating
 * modal), YouTube views + upload date, and YouTube likes + shares.
 * YouTube values come from `useYoutubeStats`; unresolved ones show an em dash.
 */
export function VideoDetailScoreboard({
    ratingAverage,
    ratingCount,
    shareCount,
    youtubeVideoUrl,
    onOpenRating
}: VideoDetailScoreboardProps) {
    const { t } = useTranslation();
    const youtubeId = extractYoutubeId(youtubeVideoUrl);
    const { data, isLoading } = useYoutubeStats(youtubeId);

    const hasRatings = ratingCount > 0;
    const pending = Boolean(youtubeId) && isLoading;

    const bigValue = (value: number | null | undefined): ReactNode => {
        if (pending) return <Skeleton className="mx-auto h-6 w-12 sm:h-8 sm:w-16" />;
        if (value === null || value === undefined) return "—";
        return formatCount(value);
    };

    const youtubeValue = (value: number | null | undefined): ReactNode => (
        <span className="flex items-center gap-1 sm:gap-1.5">
            {bigValue(value)}
            <YoutubeIcon className="size-3.5 shrink-0 sm:size-4" />
        </span>
    );

    const stars = (
        <span className="flex items-center gap-0.5 sm:gap-1">
            {STAR_POSITIONS.map((position) => (
                <StarIcon
                    key={position}
                    className={cn(
                        "size-3 sm:size-3.5",
                        hasRatings && position <= Math.round(ratingAverage)
                            ? "fill-amber-400 text-yellow-400"
                            : "text-muted-foreground/30"
                    )}
                />
            ))}
        </span>
    );

    return (
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-muted/20 p-1.5 sm:gap-2 sm:p-2">
            <ScoreboardColumn
                value={youtubeValue(data?.viewCount)}
                icon={<EyeIcon className="size-3 sm:size-3.5" />}
                label={t("videos.detail.scoreboard.views")}
                secondary={
                    data?.publishedAt == null ? (
                        t("videos.detail.scoreboard.viewsYoutube")
                    ) : (
                        <RelativeDate date={data.publishedAt} />
                    )
                }
            />
            <ScoreboardColumn
                middle={stars}
                onClick={onOpenRating}
                icon={<StarIcon className="size-3 sm:size-3.5" />}
                label={t("videos.detail.scoreboard.note")}
                ariaLabel={t("videos.detail.scoreboard.rate")}
                value={
                    hasRatings
                        ? ratingAverage.toFixed(1)
                        : t("videos.detail.scoreboard.ratingEmpty")
                }
                secondary={
                    hasRatings
                        ? t("videos.detail.scoreboard.reviews", {
                              count: ratingCount,
                              value: formatCount(ratingCount)
                          })
                        : t("videos.detail.scoreboard.clickToRate")
                }
            />
            <ScoreboardColumn
                value={youtubeValue(data?.likeCount)}
                icon={<ThumbsUpIcon className="size-3 sm:size-3.5" />}
                label={t("videos.detail.scoreboard.likes")}
                secondary={t("videos.detail.scoreboard.shares", {
                    count: shareCount,
                    value: formatCount(shareCount)
                })}
            />
        </div>
    );
}
