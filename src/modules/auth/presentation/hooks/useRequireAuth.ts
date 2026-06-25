"use client";

import { useCallback } from "react";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";

/**
 * useRequireAuth
 *
 * @description
 * Returns a guard that runs an action only when the visitor is authenticated. For a
 * guest, it opens the auth modal at the login view and resumes the action after a
 * successful login (via the modal's `onSuccess` resume hook). Use it to gate
 * actions like liking, bookmarking, or commenting.
 *
 * @returns A function `(action) => void` that gates the action behind auth.
 */
export function useRequireAuth() {
    const { isAuthenticated } = useAuth();
    const { open } = useAuthModal();

    return useCallback(
        (action: () => void) => {
            if (isAuthenticated) action();
            else open("login", { onSuccess: action });
        },
        [isAuthenticated, open]
    );
}
