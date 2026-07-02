"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { VideoCard } from "@/modules/videos/presentation/components/VideoCard";
import { useVideoDetailPopular } from "@/modules/videos/presentation/hooks/useVideoDetailPopular";
import { FlameIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

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
 * The detail page's popular-videos column: a titled strip of up to five
 * VideoCard.Horizontal rows — the exclusive section's episode cards, in the
 * same muted block with rule separators as the articles' popular sidebar —
 * sourced from `useVideoDetailPopular` (promoted first, published fallback,
 * current video excluded). While loading it shows a matching skeleton block;
 * when the resolved list is empty it renders nothing (no heading, no
 * empty-state box) so an empty column never occupies the layout.
 *
 * @param currentVideoId - The video currently open, excluded from the list.
 */
export function VideosPopularSidebar({ currentVideoId }: VideosPopularSidebarProps) {
    const { t } = useTranslation();
    const { data, isPending } = useVideoDetailPopular(currentVideoId);

    if (isPending) {
        return (
            <aside className="flex flex-col gap-4">
                <SectionHeader
                    icon={<FlameIcon />}
                    title={t("videos.detail.sidebar.popular")}
                />
                <VideosPopularSidebarLoading />
            </aside>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <aside className="flex flex-col">
            <SectionHeader
                icon={<FlameIcon />}
                title={t("videos.detail.sidebar.popular")}
            />
            <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
                {data.map((video, index) => (
                    <Fragment key={video.id}>
                        <VideoCard.Horizontal video={video} />
                        {index < data.length - 1 && <hr />}
                    </Fragment>
                ))}
            </div>
        </aside>
    );
}
