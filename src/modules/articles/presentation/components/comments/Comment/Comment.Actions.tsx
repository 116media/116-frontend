"use client";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { useCommentDisclosure } from "@/modules/articles/presentation/context/CommentDisclosureContext";

import { CommentLikeButton } from "./Comment.LikeButton";
import { CommentOwnerActions } from "./Comment.OwnerActions";
import { CommentReplyButton } from "./Comment.ReplyButton";

/**
 * Comment.Actions
 *
 * @description
 * The action strip under the body: like, reply, and the author's edit/delete controls.
 * Renders nothing while the comment is removed or being edited; each child self-guards
 * its own applicability.
 */
export function CommentActions() {
    const { isRemoved } = useCommentData();
    const { isEditing } = useCommentDisclosure();

    if (isRemoved || isEditing) return null;

    return (
        <div className="flex items-center gap-4">
            <CommentLikeButton />
            <CommentReplyButton />
            <CommentOwnerActions />
        </div>
    );
}
