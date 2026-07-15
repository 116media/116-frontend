"use client";

import { useCommentData } from "@/modules/articles/presentation/context/CommentDataContext";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Comment.Byline
 *
 * @description
 * The bubble's top line: the resolved author name and the relative post time.
 */
export function CommentByline() {
    const { displayName, comment } = useCommentData();

    return (
        <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm">{displayName}</span>
            <span className="text-muted-foreground text-xs">
                <RelativeDate date={comment.createdAt} />
            </span>
        </div>
    );
}
