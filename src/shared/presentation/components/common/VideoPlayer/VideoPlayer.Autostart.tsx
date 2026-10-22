"use client";

import { usePlayer } from "@videojs/react/video";
import { useEffect, useRef } from "react";

import { useIsPhone } from "@/shared/presentation/hooks/useIsPhone";

/**
 * VideoPlayer.Autostart
 *
 * @description
 * Starts playback on arrival, keeping the sound: a client-side navigation stays on the
 * same document, so the card click that routed here still authorises it. Phones are left
 * alone, where a browser only starts a video on the reader's own tap.
 */
export function VideoPlayerAutostart() {
    const store = usePlayer();
    const duration = usePlayer((state) => state.duration);
    const isPhone = useIsPhone();
    const hasStarted = useRef(false);

    useEffect(() => {
        if (duration <= 0) return;
        if (isPhone || hasStarted.current) return;
        if (!(navigator.userActivation?.hasBeenActive ?? true)) return;

        hasStarted.current = true;
        store.play().catch(() => {
            // Refused: the poster and its play button are already the fallback.
        });
    }, [isPhone, duration, store]);

    return null;
}
