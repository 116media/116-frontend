"use client";

import { useEffect, useRef } from "react";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { useShortKeyboardNav } from "@/modules/shorts/presentation/hooks/useShortKeyboardNav";

import { ShortsPlayerSlide } from "./ShortsPlayer.Slide";

/**
 * ShortsPlayerTrack
 *
 * @description
 * Vertical scroll-snap column of slides. Native snap handles the swipe physics; each
 * slide's observer reports the active index to the context. On open the track jumps
 * to the initially-selected short without animation.
 */
export function ShortsPlayerTrack() {
    const { shorts, activeIndex, scrollContainerRef } = useShortsPlayer();
    const didInit = useRef(false);

    useShortKeyboardNav();

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;
        const target = scrollContainerRef.current?.children.item(activeIndex) as HTMLElement | null;
        target?.scrollIntoView({ block: "start" });
    }, [scrollContainerRef, activeIndex]);

    return (
        <div
            ref={scrollContainerRef}
            className="size-full snap-y snap-mandatory overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
            {shorts.map((short, index) => (
                <ShortsPlayerSlide
                    key={short.id}
                    short={short}
                    index={index}
                />
            ))}
        </div>
    );
}
