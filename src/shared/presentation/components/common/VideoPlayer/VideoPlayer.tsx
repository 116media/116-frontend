"use client";

import dynamic from "next/dynamic";

import { extractYoutubeId } from "@/shared/presentation/utils/youtube/youtube.utils";
import { VideoPlayerPoster } from "./VideoPlayer.Poster";

/**
 * The client-only Plyr embed, loaded with SSR off because Plyr touches `window` at
 * import time. The transparent 16:9 `loading` spacer holds the frame's height so the
 * poster layer underneath shows through with no layout shift.
 */
const PlyrPlayer = dynamic(() => import("./VideoPlayer.Plyr"), {
    ssr: false,
    loading: () => <div className="aspect-video w-full" />
});

/**
 * Props for VideoPlayer.
 *
 * @interface VideoPlayerProps
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, or null when not yet attached.
 * @property {string | null} thumbnailUrl - The video thumbnail, shown as the poster frame.
 * @property {string} title - The video title, used as the poster image alt text.
 */
export interface VideoPlayerProps {
    title: string;
    thumbnailUrl: string | null;
    youtubeVideoUrl: string | null;
}

/**
 * VideoPlayer
 *
 * @description
 * The detail page's playback surface: the client-only Plyr embed above a 16:9 poster
 * layer, so server HTML and the chunk-loading window both show the thumbnail. A video
 * with no YouTube URL renders the poster frame permanently.
 */
export function VideoPlayer({ youtubeVideoUrl, thumbnailUrl, title }: VideoPlayerProps) {
    const youtubeId = extractYoutubeId(youtubeVideoUrl);

    if (!youtubeId) {
        return (
            <div className="video-player w-full overflow-hidden rounded-lg">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={thumbnailUrl}
                />
            </div>
        );
    }

    return (
        <div className="video-player relative w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0">
                <VideoPlayerPoster
                    title={title}
                    thumbnailUrl={thumbnailUrl}
                />
            </div>
            <div className="relative">
                <PlyrPlayer youtubeId={youtubeId} />
            </div>
        </div>
    );
}
