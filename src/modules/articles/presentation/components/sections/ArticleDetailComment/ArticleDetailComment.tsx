"use client";

import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Props for ArticleDetailComment.
 *
 * @interface ArticleDetailCommentProps
 * @property {IArticleCommentEntity} comment - The comment to render.
 */
export interface ArticleDetailCommentProps {
    comment: IArticleCommentEntity;
}

/**
 * commentDisplayName
 *
 * @description
 * Resolves the name shown for a comment. Prefers the server-resolved `author`
 * projection's `userName`; when the projection is absent (an unresolved commenter or a
 * deleted comment) it falls back to the generic label so a raw Guid is never rendered.
 *
 * @param comment - The comment whose author name is resolved.
 * @param fallback - The generic label for an unknown author (from i18n).
 * @returns The display name for the row.
 */
function commentDisplayName(comment: IArticleCommentEntity, fallback: string): string {
    if (comment.author?.userName) return comment.author.userName;
    return fallback;
}

/**
 * ArticleDetailComment
 *
 * @description
 * A single comment row: avatar, display name, relative post date, and body. A deleted
 * comment renders a muted "comment removed" placeholder while keeping the avatar and
 * date so the thread's shape is preserved.
 */
export function ArticleDetailComment({ comment }: ArticleDetailCommentProps) {
    const { t } = useTranslation();
    const displayName = commentDisplayName(comment, t("articles.comments.anonymousUser"));

    return (
        <div className="flex gap-3">
            <UserAvatar
                userName={displayName}
                image={comment.author?.avatarUrl ?? undefined}
                size={36}
            />
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{displayName}</span>
                    <span className="text-muted-foreground text-xs">
                        <RelativeDate date={comment.createdAt} />
                    </span>
                </div>
                {comment.isDeleted || comment.body === null ? (
                    <p className="text-muted-foreground text-sm italic">
                        {t("articles.comments.removed")}
                    </p>
                ) : (
                    <p className="whitespace-pre-wrap text-foreground text-sm">{comment.body}</p>
                )}
            </div>
        </div>
    );
}
