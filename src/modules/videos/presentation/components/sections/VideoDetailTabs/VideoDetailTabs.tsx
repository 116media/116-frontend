"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoDetailDescription } from "@/modules/videos/presentation/components/sections/VideoDetailDescription";
import { VideoDetailLyrics } from "@/modules/videos/presentation/components/sections/VideoDetailLyrics";
import { VideoDetailSimilar } from "@/modules/videos/presentation/components/sections/VideoDetailSimilar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { useStickyPinned } from "@/shared/presentation/hooks/useStickyPinned";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * alignToPlayer
 *
 * @description
 * Puts the tab row back at the line it pins to, so the incoming tab starts under the
 * player rather than wherever the reader had scrolled to, which a shorter tab would
 * otherwise leave at the footer. A row that has not reached the line yet is left alone.
 *
 * @param bar - The sticky tab row.
 */
function alignToPlayer(bar: HTMLDivElement | null): void {
    if (bar === null) return;

    const line = Number.parseFloat(getComputedStyle(bar).top);
    if (!Number.isFinite(line)) return;

    const { top } = bar.getBoundingClientRect();
    if (top > line + 1) return;

    window.scrollTo({ top: Math.max(top + window.scrollY - line, 0), behavior: "auto" });
}

/**
 * Props for VideoDetail.Tabs.
 *
 * @interface VideoDetailTabsProps
 * @property {string} videoId - The video's id, for the lyrics query.
 * @property {string} categoryId - The video's category, for the similar query.
 * @property {string} description - The video's plain-text description.
 * @property {boolean} hasLyrics - Whether the video has linked lyrics (gates the lyrics tab).
 */
export interface VideoDetailTabsProps {
    videoId: string;
    categoryId: string;
    description: string;
    hasLyrics: boolean;
}

/**
 * VideoDetail.Tabs
 *
 * @description
 * The content tabs below the header: Description (default), Lyrics (only when the video
 * has linked lyrics), and Similar videos. The tab row sticks under the pinned player on
 * mobile, reading its height from `--video-player-height`; the panel below it is as tall
 * as its content. Switching tabs brings the row back to the player. Opened-tab memory
 * feeds the lazy query flags, so lyrics/similar fire once and stay cached.
 */
export function VideoDetailTabs({
    videoId,
    categoryId,
    description,
    hasLyrics
}: VideoDetailTabsProps) {
    const { t } = useTranslation();
    const barRef = useRef<HTMLDivElement>(null);
    const isPinned = useStickyPinned(barRef);
    const [barHeight, setBarHeight] = useState(0);
    const [value, setValue] = useState("description");
    const [opened, setOpened] = useState<Set<string>>(new Set(["description"]));

    // The panel is sized against the row above it, so the row is measured rather than
    // guessed: it grows with the font scale and wraps on narrow phones.
    useEffect(() => {
        const bar = barRef.current;
        if (bar === null) return;

        const measure = () => setBarHeight(bar.getBoundingClientRect().height);
        const observer = new ResizeObserver(measure);

        measure();
        observer.observe(bar);
        return () => observer.disconnect();
    }, []);

    const handleChange = (next: string) => {
        setValue(next);
        setOpened((current) => (current.has(next) ? current : new Set(current).add(next)));

        alignToPlayer(barRef.current);
    };

    return (
        <Tabs
            size="md"
            value={value}
            onValueChange={handleChange}
            className="mt-4 flex flex-col gap-2 rounded-lg"
            style={
                {
                    "--video-tabs-bar-height": `${barHeight}px`,
                    "--video-tabs-sheet-height":
                        "calc(100dvh - var(--video-player-height, 0px) - var(--video-tabs-bar-height, 0px) - 0.5rem)"
                } as CSSProperties
            }
        >
            <div
                ref={barRef}
                className={cn(
                    "-mx-3 sticky top-[var(--video-player-height,0px)] z-30 bg-background px-3 py-2 sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0",
                    isPinned && "border-outlined border-b"
                )}
            >
                <TabsList className="scrollbar-hide w-full max-w-full overflow-x-auto rounded-md lg:w-auto lg:overflow-visible">
                    <TabsTrigger
                        value="description"
                        className="shrink-0 grow basis-auto whitespace-nowrap lg:grow-0"
                    >
                        {t("videos.detail.tabs.description")}
                    </TabsTrigger>
                    {hasLyrics && (
                        <TabsTrigger
                            value="lyrics"
                            className="shrink-0 grow basis-auto whitespace-nowrap lg:grow-0"
                        >
                            {t("videos.detail.tabs.lyrics")}
                        </TabsTrigger>
                    )}
                    <TabsTrigger
                        value="similar"
                        className="shrink-0 grow basis-auto whitespace-nowrap lg:grow-0"
                    >
                        {t("videos.detail.tabs.similar")}
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="rounded-lg border p-4 max-lg:min-h-[var(--video-tabs-sheet-height)] max-lg:rounded-none max-lg:border-0 max-lg:p-0 max-lg:pt-4">
                <TabsContent
                    value="description"
                    className="mt-0"
                >
                    <VideoDetailDescription description={description} />
                </TabsContent>
                {hasLyrics && (
                    <TabsContent
                        value="lyrics"
                        className="mt-0"
                    >
                        <VideoDetailLyrics
                            videoId={videoId}
                            enabled={opened.has("lyrics")}
                        />
                    </TabsContent>
                )}
                <TabsContent
                    value="similar"
                    className="mt-0"
                >
                    <VideoDetailSimilar
                        categoryId={categoryId}
                        currentVideoId={videoId}
                        enabled={opened.has("similar")}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}
