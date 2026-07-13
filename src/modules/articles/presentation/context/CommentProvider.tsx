"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { useAddCommentReply } from "@/modules/articles/presentation/hooks/useAddCommentReply";
import { useDeleteArticleComment } from "@/modules/articles/presentation/hooks/useDeleteArticleComment";
import { useEditArticleComment } from "@/modules/articles/presentation/hooks/useEditArticleComment";
import { useToggleArticleCommentLike } from "@/modules/articles/presentation/hooks/useToggleArticleCommentLike";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";

import { type CommentData, CommentDataContext } from "./CommentDataContext";
import { type CommentDisclosure, CommentDisclosureContext } from "./CommentDisclosureContext";
import { type CommentInteractions, CommentInteractionsContext } from "./CommentInteractionsContext";

/**
 * Props for the CommentProvider component.
 *
 * @interface CommentProviderProps
 * @property {IArticleCommentEntity} comment - The comment to provide.
 * @property {string} articleId - The article the comment belongs to.
 * @property {string} slug - The article slug.
 * @property {boolean} [isReply] - Whether this row is a reply.
 * @property {ReactNode} children - The slot arrangement that gains the comment hooks.
 */
export interface CommentProviderProps {
    comment: IArticleCommentEntity;
    articleId: string;
    slug: string;
    isReply?: boolean;
    children: ReactNode;
}

/**
 * CommentProvider
 *
 * @description
 * Owns one comment's shared state and its like/edit/delete/reply hooks, feeding the split
 * data, disclosure, and interactions contexts. Posting a reply closes the composer, opens
 * the thread, and optimistically bumps the reply count in one place.
 */
export function CommentProvider({
    comment,
    articleId,
    slug,
    isReply = false,
    children
}: CommentProviderProps) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();

    const [replyBump, setReplyBump] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const edit = useEditArticleComment(articleId);
    const remove = useDeleteArticleComment(articleId, slug);
    const addReply = useAddCommentReply(articleId, comment.id);
    const like = useToggleArticleCommentLike(comment.id, comment.likeCount, comment.isLiked);

    const beginEdit = useCallback(() => setIsEditing(true), []);
    const cancelEdit = useCallback(() => setIsEditing(false), []);
    const toggleReply = useCallback(() => setIsReplying((open) => !open), []);
    const cancelReply = useCallback(() => setIsReplying(false), []);
    const toggleReplies = useCallback(() => setShowReplies((open) => !open), []);

    const data = useMemo<CommentData>(
        () => ({
            slug,
            comment,
            isReply,
            articleId,
            replyCount: comment.replyCount + replyBump,
            isOwn: user !== null && user.id === comment.userId,
            isRemoved: comment.isDeleted || comment.body === null,
            displayName: comment.author?.userName ?? t("articles.comments.anonymousUser")
        }),
        [comment, articleId, slug, isReply, user, replyBump, t]
    );

    const disclosure = useMemo<CommentDisclosure>(
        () => ({
            isEditing,
            isReplying,
            showReplies,
            beginEdit,
            cancelEdit,
            toggleReply,
            cancelReply,
            toggleReplies
        }),
        [
            isEditing,
            isReplying,
            showReplies,
            beginEdit,
            cancelEdit,
            toggleReply,
            cancelReply,
            toggleReplies
        ]
    );

    const interactions = useMemo<CommentInteractions>(
        () => ({
            like: {
                liked: like.liked,
                count: like.count,
                toggle: () => requireAuth(like.toggle)
            },
            submitEdit: (body: string) => {
                return edit.submit(
                    { commentId: comment.id, body, parentCommentId: comment.parentCommentId },
                    cancelEdit
                );
            },
            isEditPending: edit.isPending,
            confirmDelete: () => {
                return remove.submit({
                    commentId: comment.id,
                    parentCommentId: comment.parentCommentId
                });
            },
            isDeletePending: remove.isPending,
            submitReply: (body: string) => {
                return addReply.submit(body, () => {
                    setIsReplying(false);
                    setShowReplies(true);
                    setReplyBump((bump) => bump + 1);
                });
            },
            isReplyPending: addReply.isPending
        }),
        [comment, like, edit, remove, addReply, requireAuth, cancelEdit]
    );

    return (
        <CommentDataContext.Provider value={data}>
            <CommentDisclosureContext.Provider value={disclosure}>
                <CommentInteractionsContext.Provider value={interactions}>
                    {children}
                </CommentInteractionsContext.Provider>
            </CommentDisclosureContext.Provider>
        </CommentDataContext.Provider>
    );
}
