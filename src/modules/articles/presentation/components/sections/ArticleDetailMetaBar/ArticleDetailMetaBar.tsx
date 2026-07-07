"use client";

import { useTranslation } from "react-i18next";

import { useToggleArticleBookmark } from "@/modules/articles/presentation/hooks/useToggleArticleBookmark";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { Button } from "@/shared/presentation/components/ui/Button";
import { BookmarkPlusIcon, ClockIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for ArticleDetail.MetaBar.
 *
 * @interface ArticleDetailMetaBarProps
 * @property {string} articleId - The article the bookmark mutation targets.
 * @property {number} bookmarkCount - Baseline bookmark count for the optimistic toggle.
 * @property {boolean} isBookmarked - Whether the current viewer already bookmarked the article.
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes.
 * @property {string | null} publishedAt - ISO publication date, or null.
 */
export interface ArticleDetailMetaBarProps {
    articleId: string;
    bookmarkCount: number;
    isBookmarked: boolean;
    readTimeInMinutes?: number;
    publishedAt: string | null;
}

/**
 * ArticleDetail.MetaBar
 *
 * @description
 * Meta strip below the headline: bookmark action, estimated read time, and relative
 * published date. Bookmark reuses the optimistic toggle hook seeded with the viewer's
 * state, gated behind `useRequireAuth`.
 */
export function ArticleDetailMetaBar({
    articleId,
    bookmarkCount,
    isBookmarked,
    readTimeInMinutes,
    publishedAt
}: ArticleDetailMetaBarProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount, isBookmarked);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y py-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-4">
                <Button
                    size="sm"
                    variant="outline"
                    aria-label={t("articles.detail.bookmark")}
                    onClick={() => requireAuth(bookmark.toggle)}
                    className="h-9 gap-1.5 rounded-lg px-3 text-muted-foreground"
                >
                    <BookmarkPlusIcon
                        className={cn("size-5", bookmark.bookmarked && "fill-primary text-primary")}
                    />
                    {bookmark.count > 0 && (
                        <span className={cn(bookmark.bookmarked && "text-primary")}>
                            {formatCount(bookmark.count)}
                        </span>
                    )}
                </Button>

                <span className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5" />
                    {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
                </span>
            </div>

            <RelativeDate date={publishedAt} />
        </div>
    );
}
