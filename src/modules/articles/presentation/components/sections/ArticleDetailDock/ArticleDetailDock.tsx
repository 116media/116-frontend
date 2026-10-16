"use client";

import { Fragment, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { CommentsSheet } from "@/modules/articles/presentation/components/comments/CommentsSheet";
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
import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { useScrolledPast } from "@/shared/presentation/hooks/useScrolledPast";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { resolveShareUrl } from "@/shared/presentation/utils/share/share.utils";

import type { ArticleDetailDockProps } from "./types";

/**
 * One action in the dock's pill.
 *
 * @interface IDockAction
 * @property {string} key - Stable list key.
 * @property {ReactNode} icon - The action glyph, already carrying any active-state classes.
 * @property {string} label - Accessible label (`aria-label`).
 * @property {number} count - The count shown beside the glyph.
 * @property {() => void} onClick - The action.
 * @property {boolean} [pressed] - Toggle state, for actions that have one.
 * @property {string} [countClass] - Extra classes for the count while the action is active.
 */
interface IDockAction {
    key: string;
    icon: ReactNode;
    label: string;
    count: number;
    onClick: () => void;
    pressed?: boolean;
    countClass?: string;
}

/**
 * ArticleDetail.Dock
 *
 * @description
 * Floating action dock below `lg`: like, bookmark and share in one pill with the
 * comment action beside it. Appears once the reader is past the byline strip and moving
 * down the article. Comment opens the thread in a sheet, so the reader keeps their place
 * in the article instead of being carried to the foot of it.
 */
export function ArticleDetailDock({
    articleId,
    slug,
    title,
    likeCount,
    isLiked,
    bookmarkCount,
    isBookmarked,
    shareCount,
    commentCount,
    revealAfterRef
}: ArticleDetailDockProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const direction = useScrollDirection();

    const [shareOpen, setShareOpen] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const isScrolledPast = useScrolledPast(revealAfterRef);

    const like = useToggleArticleLike(articleId, likeCount, isLiked);
    const bookmark = useToggleArticleBookmark(articleId, bookmarkCount, isBookmarked);

    const isVisible = isScrolledPast && direction === "down";

    const actions: IDockAction[] = [
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
            pressed: like.liked,
            countClass: like.liked ? "text-destructive" : undefined
        },
        {
            key: "bookmark",
            icon: (
                <BookmarkPlusIcon
                    className={cn("size-5", bookmark.bookmarked && "fill-primary text-primary")}
                />
            ),
            label: t("articles.detail.bookmark"),
            count: bookmark.count,
            onClick: () => requireAuth(bookmark.toggle),
            pressed: bookmark.bookmarked,
            countClass: bookmark.bookmarked ? "text-primary" : undefined
        },
        {
            key: "share",
            icon: <ShareIcon className="size-5" />,
            label: t("articles.detail.share"),
            count: shareCount,
            onClick: () => setShareOpen(true)
        }
    ];

    const recordShare = (channel: string) => {
        container.cradle.shareArticleUseCase.execute({ articleId, shareChannel: channel });
    };

    return (
        <Fragment>
            <div
                className={cn(
                    "fixed inset-x-12 bottom-4 z-40 flex items-center gap-2 pb-[env(safe-area-inset-bottom)] lg:hidden",
                    "transition-all duration-300",
                    isVisible
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0"
                )}
            >
                <div className="flex flex-1 items-center justify-around rounded-lg border border-outlined bg-background/80 p-2 shadow-lg backdrop-blur-xl">
                    {actions.map(({ key, icon, label, count, onClick, pressed, countClass }) => (
                        <Button
                            key={key}
                            size="icon-lg"
                            variant="ghost"
                            onClick={onClick}
                            aria-label={label}
                            aria-pressed={pressed}
                            className="gap-1 rounded-lg text-muted-foreground"
                        >
                            {icon}
                            <span className={cn(countClass)}>{formatCount(count)}</span>
                        </Button>
                    ))}
                </div>

                <Button
                    size="icon-lg"
                    variant="ghost"
                    onClick={() => setCommentsOpen(true)}
                    aria-label={t("articles.detail.comment")}
                    className="relative size-14 shrink-0 rounded-lg border border-outlined bg-background/80 shadow-lg backdrop-blur-xl hover:bg-accent"
                >
                    <MessageSquareIcon className="size-5" />
                    {commentCount > 0 && (
                        <span className="-right-1 -top-1 absolute flex size-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground tabular-nums dark:bg-secondary dark:text-secondary-foreground">
                            {commentCount > 9 ? "9+" : commentCount}
                        </span>
                    )}
                </Button>
            </div>

            <CommentsSheet
                slug={slug}
                open={commentsOpen}
                articleId={articleId}
                commentCount={commentCount}
                onOpenChange={setCommentsOpen}
            />

            <ShareModal
                title={title}
                open={shareOpen}
                onShared={recordShare}
                onOpenChange={setShareOpen}
                heading={t("articles.share.title")}
                subtitle={t("articles.share.subtitle")}
                linkLabel={t("articles.share.linkLabel")}
                copyAction={t("articles.share.copyAction")}
                nativeShareLabel={t("articles.detail.share")}
                url={resolveShareUrl(`/articles/${slug}`)}
                copiedNotification={ArticleShareNotification.linkCopied(t)}
                labels={{
                    x: t("articles.share.x"),
                    facebook: t("articles.share.facebook"),
                    whatsapp: t("articles.share.whatsapp"),
                    copy: t("articles.share.copy")
                }}
            />
        </Fragment>
    );
}
