"use client";

import { CommentActions } from "./Comment.Actions";
import { CommentAvatar } from "./Comment.Avatar";
import { CommentBody } from "./Comment.Body";
import { CommentBubble } from "./Comment.Bubble";
import { CommentByline } from "./Comment.Byline";
import { CommentReplies } from "./Comment.Replies";
import { CommentRepliesToggle } from "./Comment.RepliesToggle";
import { CommentReplyComposer } from "./Comment.ReplyComposer";
import { CommentRoot } from "./Comment.Root";
import type { CommentProps } from "./types";

/**
 * Comment.View
 *
 * @description
 * Ready-made arrangement of the Comment slots: avatar beside a bubble (byline, body,
 * actions), then the reply composer, replies toggle, and thread. Each slot self-guards its
 * own visibility from context, so this composition has no conditional branches.
 */
export function CommentView(props: CommentProps) {
    return (
        <CommentRoot {...props}>
            <CommentAvatar />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <CommentBubble>
                    <CommentByline />
                    <CommentBody />
                    <CommentActions />
                </CommentBubble>
                <CommentReplyComposer />
                <CommentRepliesToggle />
                <CommentReplies />
            </div>
        </CommentRoot>
    );
}
