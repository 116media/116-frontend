"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import type { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";
import { AuthModal } from "@/modules/auth/presentation/modal/AuthModal";

/**
 * AuthView
 *
 * @description
 * The auth modal's possible views — one per form in the flow.
 */
export type AuthView = "login" | "signup" | "verify-otp" | "forgot-password" | "reset-password";

/**
 * AuthModalContextState
 *
 * @description
 * State carried across views during a flow, plus an optional resume-after-login
 * action.
 *
 * @interface AuthModalContextState
 * @property {string} [code] - Verified OTP code, forwarded from verify-otp to reset.
 * @property {string} [email] - Email in flight (signup / password-recovery flows).
 * @property {EOtpPurpose} [purpose] - Why the OTP was issued.
 * @property {() => void} [onSuccess] - Resume action run after auth succeeds.
 */
interface AuthModalContextState {
    code?: string;
    email?: string;
    purpose?: EOtpPurpose;
    onSuccess?: () => void;
}

/**
 * The auth-modal API exposed to the app.
 *
 * @interface AuthModalApi
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {AuthView} view - The active view (top of the view history).
 * @property {boolean} canGoBack - Whether there is a previous view to return to.
 * @property {AuthModalContextState} context - Cross-view state (email/purpose/onSuccess).
 * @property {(view?: AuthView, ctx?: AuthModalContextState) => void} open - Opens the modal fresh at a view (resets history).
 * @property {() => void} close - Closes the modal and resets history/context.
 * @property {(view: AuthView, ctx?: Partial<AuthModalContextState>) => void} go - Replaces the body with another view in place (pushes history), merging context.
 * @property {() => void} back - Returns to the previous view in history.
 * @property {() => void} runOnSuccess - Runs and clears the resume action (after auth succeeds).
 */
export interface AuthModalApi {
    isOpen: boolean;
    view: AuthView;
    canGoBack: boolean;
    context: AuthModalContextState;
    open: (view?: AuthView, ctx?: AuthModalContextState) => void;
    close: () => void;
    go: (view: AuthView, ctx?: Partial<AuthModalContextState>) => void;
    back: () => void;
    runOnSuccess: () => void;
}

const AuthModalContext = createContext<AuthModalApi | null>(null);

/**
 * AuthModalProvider
 *
 * @description
 * Holds the auth modal's open state, a view-history stack, and the context
 * shared between views (email, OTP purpose, resume-after-login action).
 * Renders the single `AuthModal`; `go()` swaps its body in place.
 *
 * @param children - The app subtree that can open the modal.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<AuthView[]>(["login"]);
    const [context, setContext] = useState<AuthModalContextState>({});

    const canGoBack = history.length > 1;
    const view = history[history.length - 1];

    const open = useCallback((next: AuthView = "login", ctx: AuthModalContextState = {}) => {
        setHistory([next]);
        setContext(ctx);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const go = useCallback((next: AuthView, ctx: Partial<AuthModalContextState> = {}) => {
        setHistory((prev) => [...prev, next]);
        setContext((prev) => ({ ...prev, ...ctx }));
    }, []);

    const back = useCallback(() => {
        setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []);

    const runOnSuccess = useCallback(() => {
        context.onSuccess?.();
        setIsOpen(false);
    }, [context]);

    const api = useMemo<AuthModalApi>(
        () => ({ isOpen, view, canGoBack, context, open, close, go, back, runOnSuccess }),
        [isOpen, view, canGoBack, context, open, close, go, back, runOnSuccess]
    );

    return (
        <AuthModalContext.Provider value={api}>
            {children}
            <AuthModal />
        </AuthModalContext.Provider>
    );
}

/**
 * useAuthModal
 *
 * @description
 * Opens/closes/switches the auth modal from anywhere. Throws outside the provider.
 *
 * @returns The `AuthModalApi`.
 */
export function useAuthModal(): AuthModalApi {
    const api = useContext(AuthModalContext);
    if (!api) throw new Error("useAuthModal must be used within an AuthModalProvider");
    return api;
}
