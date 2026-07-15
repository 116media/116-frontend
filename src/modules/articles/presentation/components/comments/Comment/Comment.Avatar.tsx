"use client";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";

/**
 * Comment.Avatar
 *
 * @description
 * The commenter's avatar beside the bubble — 36px for a top-level comment, 28px for a
 * reply. Falls back to initials from the resolved display name.
 */
export function CommentAvatar() {
    const { comment, displayName, isReply } = useCommentData();

    return (
        <UserAvatar
            userName={displayName}
            image={comment.author?.avatarUrl ?? undefined}
            size={isReply ? 28 : 36}
        />
    );
}
