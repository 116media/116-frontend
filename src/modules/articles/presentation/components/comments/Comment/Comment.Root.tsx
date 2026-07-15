import type { ReactNode } from "react";

import { CommentProvider } from "@/modules/articles/presentation/context/CommentProvider";

import type { CommentProps } from "./types";

/**
 * Props for the Comment.Root component.
 *
 * @interface CommentRootProps
 * @extends {CommentProps}
 * @property {ReactNode} children - The slot arrangement to render inside the row shell.
 */
export interface CommentRootProps extends CommentProps {
    children: ReactNode;
}

/**
 * Comment.Root
 *
 * @description
 * Row shell for the Comment slots: wraps the arrangement in a `CommentProvider` and lays
 * the avatar beside the bubble column, so every slot below reads the comment, its derived
 * flags, and its mutations from context.
 */
export function CommentRoot({ comment, articleId, slug, isReply, children }: CommentRootProps) {
    return (
        <CommentProvider
            slug={slug}
            comment={comment}
            isReply={isReply}
            articleId={articleId}
        >
            <div className="flex gap-3">{children}</div>
        </CommentProvider>
    );
}
