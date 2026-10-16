"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { VideoPlaylistModal } from "@/modules/videos/presentation/components/modals/VideoPlaylistModal";
import { VideoRatingModal } from "@/modules/videos/presentation/components/modals/VideoRatingModal";
import { VideoShareModal } from "@/modules/videos/presentation/components/modals/VideoShareModal";
import { VideoDetailHeader } from "@/modules/videos/presentation/components/sections/VideoDetailHeader";
import { VideoDetailTabs } from "@/modules/videos/presentation/components/sections/VideoDetailTabs";
import { VideosPopularSidebar } from "@/modules/videos/presentation/components/sections/VideosPopularSidebar";
import { VideoPlayer } from "@/shared/presentation/components/common/VideoPlayer";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ArrowLeftIcon } from "@/shared/presentation/components/ui/Icon";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";
import { useScrolledPast } from "@/shared/presentation/hooks/useScrolledPast";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the VideoDetail assembler.
 *
 * @interface VideoDetailProps
 * @property {IVideoDetailEntity} video - The resolved video entity.
 */
export interface VideoDetailProps {
    video: IVideoDetailEntity;
}

/**
 * VideoDetail
 *
 * @description
 * The detail page assembler — the only holder of the full entity; every child receives
 * scoped props. Below `lg` the player fixes to the top of the viewport over the site
 * chrome once scrolled to, full-bleed and backed by a spacer of its own height, and
 * publishes that height so the tabs can sit right under it, in a full-bleed sheet. Owns the share/playlist/rating
 * modal open states; the playlist modal opens behind the auth gate.
 */
export function VideoDetail({ video }: VideoDetailProps) {
    const { t } = useTranslation();
    const router = useProgressRouter();
    const requireAuth = useRequireAuth();
    const [shareOpen, setShareOpen] = useState(false);
    const [playlistOpen, setPlaylistOpen] = useState(false);
    const [ratingOpen, setRatingOpen] = useState(false);

    const playerRef = useRef<HTMLDivElement>(null);
    const pinSentinelRef = useRef<HTMLDivElement>(null);
    const [playerHeight, setPlayerHeight] = useState(0);
    const isPinned = useScrolledPast(pinSentinelRef);

    useEffect(() => {
        const node = playerRef.current;
        if (node === null) return;

        const measure = () => setPlayerHeight(node.getBoundingClientRect().height);
        const observer = new ResizeObserver(measure);

        measure();
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="flex flex-col gap-6"
            style={{ "--video-player-height": `${playerHeight}px` } as CSSProperties}
        >
            <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] xl:grid-rows-[auto_auto_1fr] xl:gap-6">
                <div
                    aria-hidden
                    className="h-px xl:hidden"
                    ref={pinSentinelRef}
                />

                <div
                    ref={playerRef}
                    className={cn(
                        "z-50 overflow-hidden rounded-lg transform-gpu bg-background xl:static xl:z-auto xl:col-start-1 xl:row-start-1",
                        isPinned ? "player-pinned fixed inset-x-0 top-0 xl:relative" : "relative"
                    )}
                >
                    <VideoPlayer.Root
                        title={video.title}
                        thumbnailUrl={video.thumbnailUrl}
                        youtubeVideoUrl={video.youtubeVideoUrl}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => router.back()}
                        aria-label={t("videos.detail.backToVideos")}
                        className="absolute top-2 left-2 z-10 rounded-full bg-black/60 text-white hover:bg-black/80 hover:text-white xl:hidden"
                    >
                        <ArrowLeftIcon className="size-5" />
                    </Button>
                </div>

                <div
                    aria-hidden
                    className="xl:hidden"
                    style={{ height: isPinned ? playerHeight : 0 }}
                />

                <div className="flex min-w-0 flex-col gap-2 xl:col-start-1 xl:row-start-2">
                    <VideoDetailHeader
                        tags={video.tags}
                        title={video.title}
                        shareCount={video.shareCount}
                        ratingCount={video.ratingCount}
                        categoryName={video.categoryName}
                        publishedAt={video.publishedAt}
                        ratingAverage={video.ratingAverage}
                        youtubeVideoUrl={video.youtubeVideoUrl}
                        onShare={() => setShareOpen(true)}
                        onOpenRating={() => setRatingOpen(true)}
                        onAddToPlaylist={() => requireAuth(() => setPlaylistOpen(true))}
                    />
                </div>

                <aside className="xl:col-start-2 xl:row-span-3 xl:row-start-1">
                    <VideosPopularSidebar currentVideoId={video.id} />
                </aside>

                <div
                    data-mobile-sheet
                    className="-mx-3 min-w-0 rounded-t-2xl bg-background px-3 pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.25)] sm:-mx-6 sm:px-6 xl:mx-0 xl:rounded-none xl:px-0 xl:pb-0 xl:shadow-none xl:col-start-1 xl:row-start-3"
                >
                    <VideoDetailTabs
                        videoId={video.id}
                        hasLyrics={video.hasLyrics}
                        categoryId={video.categoryId}
                        description={video.description}
                    />
                </div>
            </div>

            <VideoShareModal
                open={shareOpen}
                slug={video.slug}
                videoId={video.id}
                title={video.title}
                onOpenChange={setShareOpen}
            />
            <VideoPlaylistModal
                open={playlistOpen}
                videoId={video.id}
                onOpenChange={setPlaylistOpen}
            />
            <VideoRatingModal
                open={ratingOpen}
                slug={video.slug}
                videoId={video.id}
                initialStars={video.ratedStars}
                onOpenChange={setRatingOpen}
            />
        </div>
    );
}
