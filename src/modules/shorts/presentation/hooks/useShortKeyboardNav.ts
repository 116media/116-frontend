"use client";

import { useEffect } from "react";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";

/**
 * useShortKeyboardNav
 *
 * @description
 * Binds the player's keyboard shortcuts while it is open: ArrowDown/ArrowUp move
 * to the next/previous short and Space pauses. Escape and focus-trapping are owned
 * by the Radix dialog, so they are not handled here.
 */
export function useShortKeyboardNav() {
    const { goNext, goPrev, togglePlay } = useShortsPlayer();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                goNext();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                goPrev();
            } else if (event.key === " " || event.code === "Space") {
                event.preventDefault();
                togglePlay();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [goNext, goPrev, togglePlay]);
}
