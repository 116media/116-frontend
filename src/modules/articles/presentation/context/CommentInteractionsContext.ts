"use client";

import { createContext, useContext } from "react";

/**
 * A comment's like toggle plus the mutation submitters and their pending flags.
 *
 * @interface CommentInteractions
 * @property {{ liked: boolean; count: number; toggle: () => void }} like - Auth-gated like toggle.
 * @property {(body: string) => void} submitEdit - Saves an edit; closes the form on success.
 * @property {boolean} isEditPending - Whether the edit mutation is in flight.
 * @property {() => void} confirmDelete - Runs the soft delete.
 * @property {boolean} isDeletePending - Whether the delete mutation is in flight.
 * @property {(body: string) => void} submitReply - Posts a reply; opens the thread on success.
 * @property {boolean} isReplyPending - Whether the reply mutation is in flight.
 */
export interface CommentInteractions {
    like: { liked: boolean; count: number; toggle: () => void };
    isEditPending: boolean;
    isDeletePending: boolean;
    isReplyPending: boolean;
    confirmDelete: () => void;
    submitReply: (body: string) => void;
    submitEdit: (body: string) => void;
}

export const CommentInteractionsContext = createContext<CommentInteractions | null>(null);

/**
 * useCommentInteractions
 *
 * @description
 * Reads a comment's like toggle and mutation submitters. Throws outside a
 * `CommentProvider`.
 *
 * @returns The `CommentInteractions` value.
 */
export function useCommentInteractions(): CommentInteractions {
    const value = useContext(CommentInteractionsContext);
    if (!value) throw new Error("useCommentInteractions must be used within a CommentProvider");
    return value;
}
