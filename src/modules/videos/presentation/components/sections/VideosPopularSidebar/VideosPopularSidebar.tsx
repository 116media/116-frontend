"use client";

import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { useVideoDetailPopular } from "@/modules/videos/presentation/hooks/useVideoDetailPopular";
import { FlameIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

import { VideosPopularSidebarLoading } from "./VideosPopularSidebar.Loading";

/**
 * Props for VideosPopularSidebar.
 *
 * @interface VideosPopularSidebarProps
 * @property {string} currentVideoId - The video currently open, excluded from the list.
 */
export interface VideosPopularSidebarProps {
    currentVideoId: string;
}

/**
 * VideosPopularSidebar
 *
 * @description
 * The detail page's popular-videos column: up to ten `VideoCard.Horizontal`
 * rows sourced from `useVideoDetailPopular` (current video excluded), rendered
 * in one shot — no infinite scroll. Renders nothing when the list is empty.
 */
export function VideosPopularSidebar({ currentVideoId }: VideosPopularSidebarProps) {
    const { t } = useTranslation();
    const { data, isPending } = useVideoDetailPopular(currentVideoId);

    const header = (
        <SectionHeader
            icon={<FlameIcon />}
            title={t("videos.detail.sidebar.popular")}
        />
    );

    return (
        <StateRenderer
            data={data}
            loading={isPending}
            skeleton={
                <aside className="flex flex-col">
                    {header}
                    <VideosPopularSidebarLoading />
                </aside>
            }
            render={(videos) => (
                <aside className="flex flex-col">
                    {header}
                    <div className="flex flex-col gap-4 rounded-xl bg-muted/25 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
                        {videos.map((video) => (
                            <VideoCard.Horizontal
                                key={video.id}
                                video={video}
                            />
                        ))}
                    </div>
                </aside>
            )}
        />
    );
}
