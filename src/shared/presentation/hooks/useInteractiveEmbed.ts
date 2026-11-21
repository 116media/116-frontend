"use client";

import { type RefObject, useEffect } from "react";

/**
 * useInteractiveEmbed
 *
 * @description
 * Lets taps reach an embedded frame. The media adapter marks its iframe
 * `pointer-events: none` inline whenever the embed's own controls are off, so the skin
 * above it can be driven instead; a skin that leans on the embed's own play button needs
 * that lifted. The adapter reapplies it whenever it re-renders, so the attribute is
 * watched rather than cleared once.
 *
 * @param containerRef - The element holding the embed.
 */
export function useInteractiveEmbed(containerRef: RefObject<HTMLElement | null>): void {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const clear = () => {
            const frame = container.querySelector<HTMLIFrameElement>("iframe");
            if (frame?.style.pointerEvents === "none") {
                frame.style.removeProperty("pointer-events");
            }
        };

        clear();

        const observer = new MutationObserver(clear);
        observer.observe(container, {
            subtree: true,
            childList: true,
            attributeFilter: ["style"]
        });

        return () => observer.disconnect();
    }, [containerRef]);
}
