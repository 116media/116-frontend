"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * useDismiss
 *
 * @description
 * Closes an open overlay (dropdown, popover, menu) on an outside pointer-down or an
 * Escape key press. Only listens while `open` is true, and treats pointer-downs inside
 * `ref` as internal (no dismiss). The latest `onDismiss` is read through a ref, so the
 * listeners are not re-bound on every render even when an inline callback is passed.
 *
 * @typeParam T - The element type the container ref points at.
 * @param open - Whether the overlay is currently open (listeners are active only then).
 * @param onDismiss - Called when an outside pointer-down or Escape should close it.
 * @param ref - Ref to the container that bounds "inside" pointer-downs.
 */
export function useDismiss<T extends HTMLElement>(
    open: boolean,
    onDismiss: () => void,
    ref: RefObject<T | null>
): void {
    const onDismissRef = useRef(onDismiss);
    onDismissRef.current = onDismiss;

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) onDismissRef.current();
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onDismissRef.current();
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, ref]);
}
