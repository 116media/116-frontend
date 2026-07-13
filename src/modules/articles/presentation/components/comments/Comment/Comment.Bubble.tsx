"use client";

import type { ReactNode } from "react";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the Comment.Bubble component.
 *
 * @interface CommentBubbleProps
 * @property {ReactNode} children - The bubble contents (byline, body, actions).
 */
export interface CommentBubbleProps {
    children: ReactNode;
}

/**
 * Comment.Bubble
 *
 * @description
 * The muted slate speech bubble holding the comment's byline, body, and actions, with a
 * rotated-square arrow tail on its left edge pointing at the avatar. Tighter padding and
 * a smaller tail for replies.
 */
export function CommentBubble({ children }: CommentBubbleProps) {
    const { isReply } = useCommentData();

    return (
        <div
            className={cn(
                "relative flex flex-col gap-1.5 rounded-md bg-muted",
                isReply ? "p-3" : "p-3 sm:p-4"
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "-left-1 absolute rotate-45 bg-muted",
                    isReply ? "top-3 size-2" : "top-3.5 size-2.5"
                )}
            />
            {children}
        </div>
    );
}
