"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";

import { VideoDetailDescription } from "./VideoDetail.Description";
import { VideoDetailLyrics } from "./VideoDetail.Lyrics";
import { VideoDetailSimilar } from "./VideoDetail.Similar";

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
 * The content tabs below the header: Description (default), Lyrics (only when
 * the video has linked lyrics), and Similar videos, on the shared animated
 * `Tabs` primitive (direction-aware slide+fade between panels, keyboard nav
 * intact). Opened-tab memory feeds the lazy query flags, so the lyrics and
 * similar queries fire only the first time their tab opens and stay cached
 * across switches.
 *
 * @param videoId - The video's id, for the lyrics query.
 * @param categoryId - The video's category, for the similar query.
 * @param description - The video's plain-text description.
 * @param hasLyrics - Whether the video has linked lyrics.
 */
export function VideoDetailTabs({
    videoId,
    categoryId,
    description,
    hasLyrics
}: VideoDetailTabsProps) {
    const { t } = useTranslation();
    const [value, setValue] = useState("description");
    const [opened, setOpened] = useState<Set<string>>(new Set(["description"]));

    const handleChange = (next: string) => {
        setValue(next);
        setOpened((current) => (current.has(next) ? current : new Set(current).add(next)));
    };

    return (
        <Tabs
            value={value}
            onValueChange={handleChange}
        >
            <TabsList>
                <TabsTrigger value="description">{t("videos.detail.tabs.description")}</TabsTrigger>
                {hasLyrics && (
                    <TabsTrigger value="lyrics">{t("videos.detail.tabs.lyrics")}</TabsTrigger>
                )}
                <TabsTrigger value="similar">{t("videos.detail.tabs.similar")}</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
                <VideoDetailDescription description={description} />
            </TabsContent>
            {hasLyrics && (
                <TabsContent value="lyrics">
                    <VideoDetailLyrics
                        videoId={videoId}
                        enabled={opened.has("lyrics")}
                    />
                </TabsContent>
            )}
            <TabsContent value="similar">
                <VideoDetailSimilar
                    categoryId={categoryId}
                    currentVideoId={videoId}
                    enabled={opened.has("similar")}
                />
            </TabsContent>
        </Tabs>
    );
}
