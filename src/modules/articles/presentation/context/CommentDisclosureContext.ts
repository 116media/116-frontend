"use client";

import { createContext, useContext } from "react";

/**
 * Open/close state of a comment's inline affordance.
 *
 * @interface CommentDisclosure
 * @property {boolean} isEditing - Whether the edit form is open.
 * @property {boolean} isReplying - Whether the reply composer is open.
 * @property {boolean} showReplies - Whether the reply thread is expanded.
 * @property {() => void} beginEdit - Opens the edit form.
 * @property {() => void} cancelEdit - Closes the edit form.
 * @property {() => void} toggleReply - Toggles the reply composer.
 * @property {() => void} cancelReply - Closes the reply composer.
 * @property {() => void} toggleReplies - Toggles the reply thread.
 */
export interface CommentDisclosure {
    isEditing: boolean;
    isReplying: boolean;
    showReplies: boolean;
    beginEdit: () => void;
    cancelEdit: () => void;
    toggleReply: () => void;
    cancelReply: () => void;
    toggleReplies: () => void;
}

export const CommentDisclosureContext = createContext<CommentDisclosure | null>(null);

/**
 * useCommentDisclosure
 *
 * @description
 * Reads a comment's edit/reply/thread open state and its setters. Throws outside a
 * `CommentProvider`.
 *
 * @returns The `CommentDisclosure` value.
 */
export function useCommentDisclosure(): CommentDisclosure {
    const value = useContext(CommentDisclosureContext);
    if (!value) throw new Error("useCommentDisclosure must be used within a CommentProvider");
    return value;
}
