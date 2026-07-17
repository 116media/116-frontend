"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortVideoPlayer } from "@/modules/shorts/presentation/components/media/ShortVideoPlayer";
import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { useShortLikeWithBurst } from "@/modules/shorts/presentation/hooks/useShortLikeWithBurst";
import { useShortViewGate } from "@/modules/shorts/presentation/hooks/useShortViewGate";

import { ShortsPlayerActionRail } from "./ShortsPlayer.ActionRail";
import { ShortsPlayerAudioControl } from "./ShortsPlayer.AudioControl";
import { ShortsPlayerCaption } from "./ShortsPlayer.Caption";
import { ShortsPlayerFullVideoLink } from "./ShortsPlayer.FullVideoLink";
import { ShortsPlayerLikeBurst } from "./ShortsPlayer.LikeBurst";

const PLAYER_WINDOW = 1;
const ACTIVE_VISIBILITY_RATIO = 0.6;

/**
 * Props for the ShortsPlayerSlide component.
 *
 * @interface ShortsPlayerSlideProps
 * @property {IShortVideoEntity} short - The short this slide plays.
 * @property {number} index - The slide's index in the track.
 */
export interface ShortsPlayerSlideProps {
    index: number;
    short: IShortVideoEntity;
}

/**
 * ShortsPlayerSlide
 *
 * @description
 * One full-viewport slide with a centered 9:16 stage: the full-controls player, the
 * action rail, and the caption. A double-click on the stage likes with a heart burst
 * (Plyr owns single-click play/pause). Reports itself active to the context when it
 * is the most-visible slide and drives the engagement-gated view event while playing.
 */
export function ShortsPlayerSlide({ short, index }: ShortsPlayerSlideProps) {
    const { activeIndex, isPlaying, isMuted, volume, scrollContainerRef, reportActive } =
        useShortsPlayer();
    const isActive = activeIndex === index;
    const slideRef = useRef<HTMLDivElement | null>(null);
    const isRendered = Math.abs(index - activeIndex) <= PLAYER_WINDOW;

    const { liked, count, onToggleLike, burst, bursting } = useShortLikeWithBurst(short);

    const onDoubleLike = () => {
        burst();
        if (!liked) onToggleLike();
    };

    useShortViewGate(short.id, isActive, isPlaying);

    useEffect(() => {
        const node = slideRef.current;
        const root = scrollContainerRef.current;
        if (!node || !root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= ACTIVE_VISIBILITY_RATIO
                    ) {
                        reportActive(index);
                    }
                }
            },
            { root, threshold: [ACTIVE_VISIBILITY_RATIO] }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [scrollContainerRef, reportActive, index]);

    return (
        <div
            ref={slideRef}
            className="relative flex h-full w-full snap-start items-center justify-center py-4"
        >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: double-click-to-like is a mouse-only enhancement; the like action is keyboard-accessible via the rail button */}
            <div
                onDoubleClick={onDoubleLike}
                className="group relative aspect-9/16 h-[min(90dvh,calc(100vw*16/9))] max-h-full overflow-hidden rounded-xl bg-black"
            >
                {isRendered ? (
                    <ShortVideoPlayer
                        isMuted={isMuted}
                        volume={volume}
                        title={short.title}
                        isActive={isActive}
                        isPlaying={isPlaying}
                        videoUrl={short.videoUrl}
                        thumbnailUrl={short.thumbnailUrl}
                    />
                ) : (
                    short.thumbnailUrl && (
                        <Image
                            fill
                            alt={short.title}
                            src={short.thumbnailUrl}
                            sizes="(max-width: 640px) 100vw, 420px"
                            className="object-cover"
                        />
                    )
                )}

                {isRendered && <ShortsPlayerAudioControl />}
                {short.hasFullVideo && short.videoSlug && (
                    <ShortsPlayerFullVideoLink videoSlug={short.videoSlug} />
                )}
                <ShortsPlayerLikeBurst show={bursting} />
                <ShortsPlayerActionRail
                    short={short}
                    liked={liked}
                    likeCount={count}
                    onToggleLike={onToggleLike}
                />
                <ShortsPlayerCaption short={short} />
            </div>
        </div>
    );
}
