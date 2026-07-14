"use client";

import { useEffect, useRef } from "react";

import { VIEW_ENGAGEMENT_MS } from "@/modules/shorts/presentation/constants/gestures";
import { useRecordShortView } from "@/modules/shorts/presentation/hooks/useRecordShortView";

/**
 * useShortViewGate
 *
 * @description
 * Fires a single deduplicated view event for a short once it has been the active,
 * playing slide for VIEW_ENGAGEMENT_MS. A per-session Set prevents re-firing when
 * the reader swipes back to an already-counted short; the timer resets if the
 * short is paused or swiped away before the threshold.
 *
 * @param shortId - The active short.
 * @param isActive - Whether this short is in view.
 * @param isPlaying - Whether playback is running.
 */
export function useShortViewGate(shortId: string, isActive: boolean, isPlaying: boolean) {
    const recordView = useRecordShortView();
    const fired = useRef<Set<string>>(new Set());
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const clear = () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        };

        if (isActive && isPlaying && !fired.current.has(shortId)) {
            timer.current = setTimeout(() => {
                fired.current.add(shortId);
                recordView(shortId);
            }, VIEW_ENGAGEMENT_MS);
        } else {
            clear();
        }

        return clear;
    }, [shortId, isActive, isPlaying, recordView]);
}
