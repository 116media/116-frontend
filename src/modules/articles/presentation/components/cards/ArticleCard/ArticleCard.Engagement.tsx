"use client";

import Link from "next/link";
import type * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToggleArticleBookmark } from "@/modules/articles/presentation/hooks/useToggleArticleBookmark";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { ArticleShareNotification } from "@/modules/articles/presentation/utils/notification/articles.share.notification";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import container from "@/shared/infrastructure/service.locator";
import { ShareModal } from "@/shared/presentation/components/common/ShareModal";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    BookmarkPlusIcon,
    HeartIcon,
    MessageSquareIcon,
    ShareIcon
} from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { resolveAbsoluteShareUrl } from "@/shared/presentation/utils/share/share.utils";

/**
 * Props for ArticleCardEngagement.
 *
 * @interface ArticleCardEngagementProps
 * @property {string} articleId - The article the mutations target.
 * @property {string} slug - The article slug (comment link target).
 * @property {string} title - The article title, carried into the share sheet.
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {number} commentCount - Comment count shown on the (navigating) comment button.
 * @property {number} [bookmarkCount] - Baseline bookmark count for the optimistic toggle.
 */
export interface ArticleCardEngagementProps {
    articleId: string;
    slug: string;
    title: string;
    likeCount: number;
    commentCount: number;
    bookmarkCount?: number;
}

/**
 * ArticleCardEngagement
 *
 * @description
 * Card action row: like and bookmark (optimistic, auth-gated), comment (navigates to the
 * article's comments), and share, which opens the shared share sheet. Every button stops
 * propagation so it never follows the card's article link.
 */
export function ArticleCardEngagement({
    articleId,
    slug,
    title,
    likeCount,
    commentCount,
    bookmarkCount
}: ArticleCardEngagementProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const like = useToggleArticleLike(articleId, likeCount);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount ?? 0);
    const [shareOpen, setShareOpen] = useState(false);

    const recordShare = (channel: string) => {
        container.cradle.shareArticleUseCase.execute({ articleId, shareChannel: channel });
    };

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
                    onClick={stop(() => setShareOpen(true))}
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

            <ShareModal
                title={title}
                open={shareOpen}
                onShared={recordShare}
                onOpenChange={setShareOpen}
                heading={t("articles.share.title")}
                subtitle={t("articles.share.subtitle")}
                linkLabel={t("articles.share.linkLabel")}
                copyAction={t("articles.share.copyAction")}
                nativeShareLabel={t("articles.card.share")}
                url={resolveAbsoluteShareUrl(`/articles/${slug}`)}
                copiedNotification={ArticleShareNotification.linkCopied(t)}
                labels={{
                    facebook: t("articles.share.facebook"),
                    x: t("articles.share.x"),
                    whatsapp: t("articles.share.whatsapp"),
                    copy: t("articles.share.copy")
                }}
            />
        </div>
    );
}
