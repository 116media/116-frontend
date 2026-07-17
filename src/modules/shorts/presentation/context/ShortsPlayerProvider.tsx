"use client";

import {
    createContext,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { prefersReducedMotion } from "@/modules/shorts/presentation/utils/shorts/shorts.utils";

/**
 * ShortsPlayerContextValue
 *
 * @description
 * The player's shared state and actions, consumed by every compound slot.
 *
 * @interface ShortsPlayerContextValue
 * @property {IShortVideoEntity[]} shorts - The ordered feed slice.
 * @property {number} activeIndex - Index of the short currently in view.
 * @property {boolean} isPlaying - Whether the active short is playing.
 * @property {boolean} isMuted - Session-wide mute state.
 * @property {number} volume - Session-wide playback volume (0 to 1).
 * @property {RefObject<HTMLDivElement | null>} scrollContainerRef - The vertical snap track element.
 * @property {() => void} goNext - Scroll to the next short.
 * @property {() => void} goPrev - Scroll to the previous short.
 * @property {(index: number) => void} reportActive - Mark a short active from the scroll observer.
 * @property {() => void} togglePlay - Pause/unpause the active short.
 * @property {() => void} toggleMute - Toggle session mute.
 * @property {(volume: number) => void} setVolume - Set the session volume; a value above 0 clears the mute state.
 */
export interface ShortsPlayerContextValue {
    isMuted: boolean;
    isPlaying: boolean;
    volume: number;
    activeIndex: number;
    shorts: IShortVideoEntity[];
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    goNext: () => void;
    goPrev: () => void;
    togglePlay: () => void;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    reportActive: (index: number) => void;
}

const ShortsPlayerContext = createContext<ShortsPlayerContextValue | null>(null);

/**
 * useShortsPlayer
 *
 * @description
 * Reads the shorts-player context; throws when used outside the provider.
 *
 * @returns {ShortsPlayerContextValue} The player context value.
 */
export function useShortsPlayer(): ShortsPlayerContextValue {
    const context = useContext(ShortsPlayerContext);
    if (!context) throw new Error("useShortsPlayer must be used within ShortsPlayerProvider");
    return context;
}

/**
 * Props for the ShortsPlayerProvider component.
 *
 * @interface ShortsPlayerProviderProps
 * @property {IShortVideoEntity[]} shorts - The feed slice to play through.
 * @property {number} initialIndex - The short to open on.
 * @property {boolean} hasNextPage - Whether more shorts can be loaded.
 * @property {() => void} onLoadMore - Fetches the next page as the end nears.
 * @property {(short: IShortVideoEntity) => void} [onActiveShortChange] - Notified when the active short changes (URL sync).
 * @property {ReactNode} children - The compound slots.
 */
export interface ShortsPlayerProviderProps {
    children: ReactNode;
    initialIndex: number;
    hasNextPage: boolean;
    onLoadMore: () => void;
    onActiveShortChange?: (short: IShortVideoEntity) => void;
    shorts: IShortVideoEntity[];
}

/**
 * ShortsPlayerProvider
 *
 * @description
 * Owns active-index and playback state for the player. Navigation scrolls the
 * target slide into the snap track; the track's observer reports the settled
 * active index back. Fetches the next page as the reader nears the last short.
 */
export function ShortsPlayerProvider({
    shorts,
    initialIndex,
    hasNextPage,
    onLoadMore,
    onActiveShortChange,
    children
}: ShortsPlayerProviderProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.8);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const activeShort = shorts[activeIndex];
        if (activeShort) onActiveShortChange?.(activeShort);
    }, [activeIndex, shorts, onActiveShortChange]);

    const maybeLoadMore = useCallback(
        (index: number) => {
            if (hasNextPage && index >= shorts.length - 2) onLoadMore();
        },
        [hasNextPage, shorts.length, onLoadMore]
    );

    const goTo = useCallback(
        (index: number) => {
            const clamped = Math.max(0, Math.min(index, shorts.length - 1));
            const target = scrollContainerRef.current?.children.item(clamped) as HTMLElement | null;
            target?.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
                block: "start"
            });
            maybeLoadMore(clamped);
        },
        [shorts.length, maybeLoadMore]
    );

    const reportActive = useCallback(
        (index: number) => {
            setActiveIndex((previous) => (previous === index ? previous : index));
            setIsPlaying(true);
            maybeLoadMore(index);
        },
        [maybeLoadMore]
    );

    const value = useMemo<ShortsPlayerContextValue>(
        () => ({
            shorts,
            isMuted,
            isPlaying,
            volume,
            activeIndex,
            reportActive,
            scrollContainerRef,
            goNext: () => goTo(activeIndex + 1),
            goPrev: () => goTo(activeIndex - 1),
            toggleMute: () => setIsMuted((muted) => !muted),
            togglePlay: () => setIsPlaying((playing) => !playing),
            setVolume: (next: number) => {
                setVolumeState(next);
                setIsMuted(next === 0);
            }
        }),
        [shorts, activeIndex, isPlaying, isMuted, volume, goTo, reportActive]
    );

    return <ShortsPlayerContext.Provider value={value}>{children}</ShortsPlayerContext.Provider>;
}
