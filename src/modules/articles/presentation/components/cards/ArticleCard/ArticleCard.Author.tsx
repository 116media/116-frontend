"use client";

import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";

/**
 * Props for ArticleCardAuthor.
 *
 * @interface ArticleCardAuthorProps
 * @property {IArticleAuthor} [author] - The author projection, or undefined if unresolved.
 */
export interface ArticleCardAuthorProps {
    author?: IArticleAuthor;
}

/**
 * ArticleCardAuthor
 *
 * @description
 * Byline row with the author's avatar and display name. Falls back gracefully when the
 * author projection is absent; the published date lives in {@link ArticleCardMeta}.
 */
export function ArticleCardAuthor({ author }: ArticleCardAuthorProps) {
    return (
        <div className="flex items-center gap-2">
            <UserAvatar
                size={32}
                userName={author?.userName ?? ""}
                image={author?.avatarUrl ?? undefined}
            />
            <span className="font-medium text-sm">{author?.userName}</span>
        </div>
    );
}
