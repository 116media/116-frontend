"use client";

import { useTranslation } from "react-i18next";

import { MessageSquareIcon, ShareIcon, StarIcon } from "@/shared/presentation/components/ui/Icon";
import { STAR_POSITIONS } from "@/shared/presentation/constants/rating";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatRelativeDate } from "@/shared/presentation/utils/format/format.utils";

export type FavoriteCardDateKind = "saved" | "shared" | "bookmarked" | "liked" | "rated";

const DATE_KEY: Record<FavoriteCardDateKind, string> = {
    saved: "favorites.activity.savedAt",
    shared: "favorites.activity.sharedAt",
    bookmarked: "favorites.activity.bookmarkedAt",
    liked: "favorites.activity.likedAt",
    rated: "favorites.activity.ratedAt"
};

/**
 * Props for FavoriteCard.Meta.
 *
 * @interface FavoriteCardMetaProps
 * @property {string | null} [date] - ISO timestamp of the interaction, rendered relative.
 * @property {FavoriteCardDateKind} [dateKind] - Which relative-date label to use for `date`.
 * @property {number} [commentCount] - The caller's own comment count on the item.
 * @property {number} [shareCount] - The caller's own share count on the item.
 * @property {string} [shareChannel] - The most recent share channel, shown beside the share count.
 * @property {number} [rating] - The caller's own star rating (1–5).
 * @property {string} [className] - Extra classes merged onto the row.
 */
export interface FavoriteCardMetaProps {
    rating?: number;
    className?: string;
    shareCount?: number;
    shareChannel?: string;
    commentCount?: number;
    date?: string | null;
    dateKind?: FavoriteCardDateKind;
}

/**
 * FavoriteCard.Meta
 *
 * @description
 * The locale-aware activity row inside the body: an optional relative timestamp, own
 * comment/share counts, share channel, and own star rating. Renders only the pieces it
 * is given; dates and counts go through the shared formatters/plurals.
 */
export function FavoriteCardMeta({
    date,
    dateKind = "saved",
    commentCount,
    shareCount,
    shareChannel,
    rating,
    className
}: FavoriteCardMetaProps) {
    const { t, i18n } = useTranslation();
    const relative = formatRelativeDate(date ?? null, i18n.language);

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs",
                className
            )}
        >
            {relative && (
                <span suppressHydrationWarning>{t(DATE_KEY[dateKind], { date: relative })}</span>
            )}

            {typeof commentCount === "number" && (
                <span className="flex items-center gap-1">
                    <MessageSquareIcon className="size-3.5" />
                    {t("favorites.activity.commentCount", { count: commentCount })}
                </span>
            )}

            {typeof shareCount === "number" && (
                <span className="flex items-center gap-1">
                    <ShareIcon className="size-3.5" />
                    {t("favorites.activity.shareCount", { count: shareCount })}
                    {shareChannel ? ` · ${shareChannel}` : null}
                </span>
            )}

            {typeof rating === "number" && rating > 0 && (
                <span className="flex items-center gap-1">
                    <span>{t("favorites.activity.yourRating")}</span>
                    <span className="flex items-center">
                        {STAR_POSITIONS.map((position) => (
                            <StarIcon
                                key={position}
                                aria-hidden
                                className={cn(
                                    "size-3.5",
                                    position <= rating
                                        ? "fill-amber-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        ))}
                    </span>
                </span>
            )}
        </div>
    );
}
