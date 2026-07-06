"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useYoutubeStats } from "@/modules/videos/presentation/hooks/useYoutubeStats";
import { EyeIcon, StarIcon, ThumbsUpIcon } from "@/shared/presentation/components/ui/Icon";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { cn } from "@/shared/presentation/utils/cn";
import { formatCount } from "@/shared/presentation/utils/formatCount";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube";

/**
 * The five star positions of the rating display row.
 */
const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

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
 * One column of the scoreboard: an uppercase icon+label header, a large primary
 * value, an optional middle slot (the rating stars), and a muted secondary line.
 * Renders as a button when `onClick` is supplied so the whole column is the
 * rating affordance.
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
        <>
            <span className="flex items-center gap-1.5 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                {icon}
                {label}
            </span>
            <span className="font-bold text-2xl text-foreground tabular-nums md:text-3xl">
                {value}
            </span>
            {middle}
            <span className="text-muted-foreground text-xs">{secondary}</span>
        </>
    );

    const layout = "flex flex-col items-center gap-1.5 px-2 py-1 text-center";

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={ariaLabel}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl p-2 hover:bg-accent/40"
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
 * The video's headline stats board under the title: a slate/grey gradient
 * surface (muted tokens, light/dark aware) split into three ruled columns —
 * the rating (average, star row, review count; the whole column is a button
 * that opens the rating modal), YouTube views (with the comment count below),
 * and YouTube likes (with the backend share count below). Views, likes, and
 * comments come from the YouTube Data API via `useYoutubeStats`; while that
 * query is in flight the affected values show a skeleton, and a value the API
 * cannot resolve renders as an em dash (hidden, not zero). The rating and share
 * figures come from the entity and are always present.
 *
 * @param ratingAverage - Cached average star rating.
 * @param ratingCount - Cached total number of ratings.
 * @param shareCount - The backend's own share count.
 * @param youtubeVideoUrl - The video's YouTube URL, source of the stats id.
 * @param onOpenRating - Opens the rating modal.
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
        if (pending) return <Skeleton className="mx-auto h-8 w-16" />;
        if (value === null || value === undefined) return "—";
        return formatCount(value);
    };

    const stars = (
        <span className="flex items-center gap-1 ">
            {STAR_POSITIONS.map((position) => (
                <StarIcon
                    key={position}
                    className={cn(
                        "size-3.5",
                        hasRatings && position <= Math.round(ratingAverage)
                            ? "fill-amber-400 text-yellow-400"
                            : "text-muted-foreground/30"
                    )}
                />
            ))}
        </span>
    );

    return (
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/20 p-2">
            <ScoreboardColumn
                value={bigValue(data?.viewCount)}
                icon={<EyeIcon className="size-3.5" />}
                label={t("videos.detail.scoreboard.views")}
                secondary={
                    data?.commentCount == null && !pending
                        ? t("videos.detail.scoreboard.viewsYoutube")
                        : t("videos.detail.scoreboard.comments", {
                              count: data?.commentCount ?? 0,
                              value: formatCount(data?.commentCount ?? 0)
                          })
                }
            />
            <ScoreboardColumn
                middle={stars}
                onClick={onOpenRating}
                icon={<StarIcon className="size-3.5" />}
                label={t("videos.detail.scoreboard.note")}
                ariaLabel={t("videos.detail.scoreboard.rate")}
                value={hasRatings ? ratingAverage.toFixed(1) : "—"}
                secondary={t("videos.detail.scoreboard.reviews", {
                    count: ratingCount,
                    value: formatCount(ratingCount)
                })}
            />
            <ScoreboardColumn
                value={bigValue(data?.likeCount)}
                icon={<ThumbsUpIcon className="size-3.5" />}
                label={t("videos.detail.scoreboard.likes")}
                secondary={t("videos.detail.scoreboard.shares", {
                    count: shareCount,
                    value: formatCount(shareCount)
                })}
            />
        </div>
    );
}
