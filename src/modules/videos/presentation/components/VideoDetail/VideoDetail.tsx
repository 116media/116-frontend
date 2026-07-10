"use client";

import { useState } from "react";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { VideosPopularSidebar } from "@/modules/videos/presentation/components/VideosPopularSidebar";

import { VideoDetailHeader } from "./VideoDetail.Header";
import { VideoDetailTabs } from "./VideoDetail.Tabs";
import { VideoDetailPlayer } from "./VideoDetailPlayer";
import { VideoPlaylistModal } from "./VideoPlaylistModal";
import { VideoRatingModal } from "./VideoRatingModal";
import { VideoShareModal } from "./VideoShareModal";

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
 * The detail page assembler — the only holder of the full entity; every child
 * receives scoped props. Lays the page out as a two-column grid on desktop
 * (player/header/tags/tabs left, popular-videos sidebar right, stacked on
 * mobile) and owns the share/playlist modal open states. The playlist modal
 * opens behind the auth gate, so guests get the login modal and the open
 * resumes after; both modals mount once at the root.
 *
 * @param video - The resolved video entity.
 */
export function VideoDetail({ video }: VideoDetailProps) {
    const requireAuth = useRequireAuth();
    const [shareOpen, setShareOpen] = useState(false);
    const [playlistOpen, setPlaylistOpen] = useState(false);
    const [ratingOpen, setRatingOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="lg:grid lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-6">
                <div className="flex min-w-0 flex-col gap-2">
                    <VideoDetailPlayer
                        title={video.title}
                        thumbnailUrl={video.thumbnailUrl}
                        youtubeVideoUrl={video.youtubeVideoUrl}
                    />
                    <VideoDetailHeader
                        tags={video.tags}
                        title={video.title}
                        shareCount={video.shareCount}
                        ratingCount={video.ratingCount}
                        categoryName={video.categoryName}
                        ratingAverage={video.ratingAverage}
                        youtubeVideoUrl={video.youtubeVideoUrl}
                        onShare={() => setShareOpen(true)}
                        onOpenRating={() => setRatingOpen(true)}
                        onAddToPlaylist={() => requireAuth(() => setPlaylistOpen(true))}
                    />
                    <VideoDetailTabs
                        videoId={video.id}
                        hasLyrics={video.hasLyrics}
                        categoryId={video.categoryId}
                        description={video.description}
                    />
                </div>

                <aside className="mt-10 lg:mt-0">
                    <VideosPopularSidebar currentVideoId={video.id} />
                </aside>
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
                onOpenChange={setRatingOpen}
            />
        </div>
    );
}
