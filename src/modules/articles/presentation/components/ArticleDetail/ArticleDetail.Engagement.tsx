"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { useShareArticle } from "@/modules/articles/presentation/hooks/useShareArticle";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";
import { Button } from "@/shared/presentation/components/ui/Button";
import { HeartIcon, MessageSquareIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";
import { formatCount } from "@/shared/presentation/utils/formatCount";

/**
 * One engagement pill in the byline strip.
 *
 * @interface IEngagementAction
 * @property {string} key - Stable list key.
 * @property {ReactNode} icon - The action glyph, already carrying any active-state classes.
 * @property {string} label - Accessible label (`aria-label`).
 * @property {number} count - The count shown beside the glyph.
 * @property {() => void} onClick - The pill's action.
 * @property {string} [countClass] - Extra classes for the count when the action is active.
 */
interface IEngagementAction {
    key: string;
    icon: ReactNode;
    label: string;
    count: number;
    onClick: () => void;
    countClass?: string;
}

/**
 * Props for ArticleDetail.Engagement.
 *
 * @interface ArticleDetailEngagementProps
 * @property {string} articleId - The article the like mutation targets.
 * @property {string} slug - The article slug, used to build the share URL.
 * @property {IArticleAuthor} [author] - The byline author (avatar, name).
 * @property {number} likeCount - Baseline like count for the optimistic toggle.
 * @property {number} commentCount - Comment count shown on the comment pill.
 * @property {number} shareCount - Share count shown on the share pill.
 * @property {boolean} isLiked - Whether the current viewer already likes the article.
 * @property {() => void} onComment - Scrolls to and focuses the on-page comment composer.
 */
export interface ArticleDetailEngagementProps {
    slug: string;
    isLiked: boolean;
    articleId: string;
    likeCount: number;
    shareCount: number;
    commentCount: number;
    onComment: () => void;
    author?: IArticleAuthor;
}

/**
 * ArticleDetail.Engagement
 *
 * @description
 * The byline strip directly below the title: the author — avatar, a "written by" label, and
 * the author name — on the left, and the engagement actions (like, comment, share) as
 * outlined count pills on the right. Like reuses the feed's optimistic toggle hook, seeded
 * with the viewer's real `isLiked` state, and is gated behind `useRequireAuth` (a guest tap
 * opens the auth modal and resumes on success). The comment pill invokes `onComment` to
 * smooth-scroll to and focus the composer; the share pill opens the native share sheet
 * (clipboard fallback) and records the share. The liked state uses the destructive token.
 * Bookmarking lives in the meta bar below the headline, not in this strip.
 *
 * @param articleId - The article the like mutation targets.
 * @param slug - The article slug, used to build the share URL.
 * @param author - The byline author, if resolved.
 * @param likeCount - Baseline like count.
 * @param commentCount - Comment count shown on the comment pill.
 * @param shareCount - Share count shown on the share pill.
 * @param isLiked - The viewer's like state baseline.
 * @param onComment - Scrolls to and focuses the on-page comment composer.
 */
export function ArticleDetailEngagement({
    articleId,
    slug,
    author,
    likeCount,
    commentCount,
    shareCount,
    isLiked,
    onComment
}: ArticleDetailEngagementProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const like = useToggleArticleLike(articleId, likeCount, isLiked);
    const share = useShareArticle(articleId, slug);

    const actions: IEngagementAction[] = [
        {
            key: "like",
            icon: (
                <HeartIcon
                    className={cn("size-5", like.liked && "fill-destructive text-destructive")}
                />
            ),
            label: t("articles.detail.like"),
            count: like.count,
            onClick: () => requireAuth(like.toggle),
            countClass: like.liked ? "text-destructive" : undefined
        },
        {
            key: "comment",
            icon: <MessageSquareIcon className="size-5" />,
            label: t("articles.detail.comment"),
            count: commentCount,
            onClick: onComment
        },
        {
            key: "share",
            icon: <ShareIcon className="size-5" />,
            label: t("articles.detail.share"),
            count: shareCount,
            onClick: () => share()
        }
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
            {author && (
                <div className="flex items-center gap-3">
                    <UserAvatar
                        size={36}
                        userName={author.userName}
                        image={author.avatarUrl ?? undefined}
                    />
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">
                            {t("articles.detail.writtenBy")}
                        </span>
                        <span className="font-semibold text-foreground text-sm">
                            {author.userName}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2">
                {actions.map(({ key, icon, label, count, onClick, countClass }) => (
                    <Button
                        key={key}
                        size="sm"
                        variant="outline"
                        aria-label={label}
                        className="h-9 gap-1.5 rounded-lg px-3 text-muted-foreground"
                        onClick={onClick}
                    >
                        {icon}
                        <span className={cn(countClass)}>{formatCount(count)}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
