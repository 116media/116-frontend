"use client";

import { usePlayer } from "@videojs/react/video";
import { useEffect, useRef } from "react";

/**
 * VideoPlayer.Autostart
 *
 * @description
 * Starts playback on arrival, keeping the sound: a client-side navigation stays on the
 * same document, so the card click that routed here still authorises it. A browser that
 * refuses leaves the poster and its play button exactly as they were.
 */
export function VideoPlayerAutostart() {
    const store = usePlayer();
    const duration = usePlayer((state) => state.duration);
    const hasStarted = useRef(false);

    useEffect(() => {
        // An embed reports no `canPlay` until it is already playing, so readiness is read
        // off the duration it publishes with its metadata.
        if (duration <= 0 || hasStarted.current) return;

        // Undefined on browsers without the API: try anyway and let the refusal decide.
        if (!(navigator.userActivation?.hasBeenActive ?? true)) return;

        hasStarted.current = true;
        store.play().catch(() => {
            // Refused: the poster and its play button are already the fallback.
        });
    }, [duration, store]);

    return null;
}
