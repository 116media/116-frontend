"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { LIKE_BURST_MS } from "@/modules/shorts/presentation/constants/gestures";
import { useToggleShortLike } from "@/modules/shorts/presentation/hooks/useToggleShortLike";
import { prefersReducedMotion } from "@/modules/shorts/presentation/utils/shorts/shorts.utils";

/**
 * useShortLikeWithBurst
 *
 * @description
 * Single source of like state for a slide, shared by the action rail and the
 * double-tap gesture. Wraps {@link useToggleShortLike} (seeded from `isLiked`) with
 * an auth-gated toggle and a transient heart-burst flag; the burst is suppressed
 * under reduced-motion.
 *
 * @param short - The slide's short.
 * @returns `{ liked, count, onToggleLike, burst, bursting }` for the rail and tap layer.
 */
export function useShortLikeWithBurst(short: IShortVideoEntity) {
    const requireAuth = useRequireAuth();
    const { liked, count, toggle } = useToggleShortLike(short.id, short.likeCount, short.isLiked);
    const [bursting, setBursting] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current);
        },
        []
    );

    const onToggleLike = useCallback(() => requireAuth(toggle), [requireAuth, toggle]);

    const burst = useCallback(() => {
        if (prefersReducedMotion()) return;
        if (timer.current) clearTimeout(timer.current);
        setBursting(true);
        timer.current = setTimeout(() => setBursting(false), LIKE_BURST_MS);
    }, []);

    return { liked, count, onToggleLike, burst, bursting };
}
