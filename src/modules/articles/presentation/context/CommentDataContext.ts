"use client";

import { createContext, useContext } from "react";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";

/**
 * Identity of one comment plus the flags derived from it. Static for a given comment,
 * except `replyCount`, which tracks optimistic reply inserts.
 *
 * @interface CommentData
 * @property {IArticleCommentEntity} comment - The comment being rendered.
 * @property {string} articleId - The article the comment belongs to.
 * @property {string} slug - The article slug, to keep the cached detail count in step.
 * @property {boolean} isReply - Whether this row is a reply.
 * @property {boolean} isOwn - Whether the current user authored the comment.
 * @property {boolean} isRemoved - Whether the comment is soft-deleted.
 * @property {string} displayName - Resolved author name, with anonymous fallback.
 * @property {number} replyCount - Live reply count, including optimistic inserts.
 */
export interface CommentData {
    comment: IArticleCommentEntity;
    articleId: string;
    slug: string;
    isReply: boolean;
    isOwn: boolean;
    isRemoved: boolean;
    displayName: string;
    replyCount: number;
}

export const CommentDataContext = createContext<CommentData | null>(null);

/**
 * useCommentData
 *
 * @description
 * Reads a comment's identity and derived flags. Throws outside a `CommentProvider`.
 *
 * @returns The `CommentData` value.
 */
export function useCommentData(): CommentData {
    const value = useContext(CommentDataContext);
    if (!value) throw new Error("useCommentData must be used within a CommentProvider");
    return value;
}
