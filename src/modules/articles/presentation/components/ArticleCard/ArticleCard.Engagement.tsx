"use client";

import Link from "next/link";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { useShareArticle } from "@/modules/articles/presentation/hooks/useShareArticle";
import { useToggleArticleBookmark } from "@/modules/articles/presentation/hooks/useToggleArticleBookmark";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    BookmarkPlusIcon,
    HeartIcon,
    MessageSquareIcon,
    ShareIcon
} from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for ArticleCardEngagement.
 *
 * @interface ArticleCardEngagementProps
 * @property {string} articleId - The article the mutations target.
 * @property {string} slug - The article slug (comment link target).
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {number} commentCount - Comment count shown on the (navigating) comment button.
 * @property {number} [bookmarkCount] - Baseline bookmark count for the optimistic toggle.
 */
export interface ArticleCardEngagementProps {
    articleId: string;
    slug: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount?: number;
}

/**
 * ArticleCardEngagement
 *
 * @description
 * The card's action row with four interactions: like (optimistic toggle, auth-gated),
 * comment (navigates to the article's comments), share, and bookmark (optimistic toggle,
 * auth-gated). Every button stops propagation so it never follows the card's article
 * link.
 *
 * @param articleId - The article the mutations target.
 * @param slug - The article slug (comment link target).
 * @param likeCount - Baseline like count.
 * @param commentCount - Comment count shown on the comment button.
 * @param bookmarkCount - Baseline bookmark count.
 */
export function ArticleCardEngagement({
    articleId,
    slug,
    likeCount,
    commentCount,
    bookmarkCount
}: ArticleCardEngagementProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const like = useToggleArticleLike(articleId, likeCount);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount ?? 0);
    const share = useShareArticle(articleId, slug);

    const stop = (fn: () => void) => (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        fn();
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("articles.card.like")}
                    className="h-8 gap-1 px-2 text-muted-foreground"
                    onClick={stop(() => requireAuth(like.toggle))}
                >
                    <HeartIcon
                        className={cn("size-4", like.liked && "fill-destructive text-destructive")}
                    />
                    <span className={cn(like.liked && "text-destructive")}>{like.count}</span>
                </Button>

                <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    aria-label={t("articles.card.comments")}
                    className="h-8 gap-1 px-2 text-muted-foreground"
                >
                    <Link
                        href={`/articles/${slug}?comments=1`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <MessageSquareIcon className="size-4" />
                        <span>{commentCount}</span>
                    </Link>
                </Button>

                <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t("articles.card.share")}
                    className="h-8 gap-1 px-2 text-muted-foreground"
                    onClick={stop(share)}
                >
                    <ShareIcon className="size-4" />
                    <span>{t("articles.card.share")}</span>
                </Button>
            </div>

            <Button
                size="icon"
                variant="outline"
                aria-label={t("articles.card.bookmark")}
                className="size-8 text-muted-foreground"
                onClick={stop(() => requireAuth(bookmark.toggle))}
            >
                <BookmarkPlusIcon
                    className={cn("size-5!", bookmark.bookmarked && "fill-primary text-primary")}
                />
            </Button>
        </div>
    );
}
