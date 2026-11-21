"use client";

import { useEffect, useState } from "react";

/**
 * A phone, by pointer as well as width, so a narrow desktop window is not mistaken for
 * one: a phone takes touch-sized controls, a narrow window keeps the pointer-sized ones.
 */
const PHONE_QUERY = "(max-width: 639px) and (pointer: coarse)";

/**
 * useIsPhone
 *
 * @description
 * Tracks {@link PHONE_QUERY}. Unlike `useMediaQuery` it is seeded on the first render
 * rather than after it, for callers that would otherwise mount one tree and immediately
 * swap it for another — a media element rebuilt that way loses what it had loaded.
 *
 * @returns Whether the viewport is a phone.
 */
export function useIsPhone(): boolean {
    const [isPhone, setIsPhone] = useState(
        () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches
    );

    useEffect(() => {
        const list = window.matchMedia(PHONE_QUERY);
        setIsPhone(list.matches);

        const onChange = (event: MediaQueryListEvent) => setIsPhone(event.matches);
        list.addEventListener("change", onChange);

        return () => list.removeEventListener("change", onChange);
    }, []);

    return isPhone;
}
