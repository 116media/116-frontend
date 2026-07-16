"use client";

import { useTranslation } from "react-i18next";

import { MessageSquareIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Props for FavoriteCard.Comment.
 *
 * @interface FavoriteCardCommentProps
 * @property {string | null} body - The caller's latest comment text, or null when deleted.
 * @property {number} [commentCount] - Total comments the caller left on the item.
 * @property {string | null} [date] - ISO timestamp of the latest comment, rendered relative.
 */
export interface FavoriteCardCommentProps {
    body: string | null;
    commentCount?: number;
    date?: string | null;
}

/**
 * FavoriteCard.Comment
 *
 * @description
 * The latest-comment block inside the body: a labelled header with the relative date, the
 * clamped comment text, and an optional total-comment count. Separated from the rows above
 * by a top border.
 */
export function FavoriteCardComment({ body, commentCount, date }: FavoriteCardCommentProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2 border-t pt-2">
            <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground text-sm">
                    {t("favorites.activity.latestComment")}
                </span>
                {date && (
                    <span className="text-muted-foreground text-xs">
                        <RelativeDate date={date} />
                    </span>
                )}
            </div>

            {body && (
                <p className="line-clamp-3 whitespace-pre-wrap text-muted-foreground text-sm">
                    {body}
                </p>
            )}

            {typeof commentCount === "number" && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MessageSquareIcon className="size-3.5" />
                    {t("favorites.activity.commentCount", { count: commentCount })}
                </span>
            )}
        </div>
    );
}
