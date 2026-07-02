"use client";

import dynamic from "next/dynamic";

import { extractYoutubeId } from "@/shared/presentation/utils/youtube";
import { VideoDetailPlayerPoster } from "./VideoDetailPlayer.Poster";

/**
 * The client-only Plyr embed, loaded with SSR off because Plyr touches
 * `window` at import time. The `loading` fallback is a transparent 16:9
 * spacer: it holds the frame's height while the chunk loads, letting the
 * poster layer underneath (which carries the real thumbnail) show through
 * with no layout shift.
 */
const PlyrPlayer = dynamic(() => import("./VideoDetailPlayer.Plyr"), {
    ssr: false,
    loading: () => <div className="aspect-video w-full" />
});

/**
 * Props for VideoDetailPlayer.
 *
 * @interface VideoDetailPlayerProps
 * @property {string | null} youtubeVideoUrl - The video's YouTube URL, or null when not yet attached.
 * @property {string | null} thumbnailUrl - The video thumbnail, shown as the poster frame.
 * @property {string} title - The video title, used as the poster image alt text.
 */
export interface VideoDetailPlayerProps {
    youtubeVideoUrl: string | null;
    thumbnailUrl: string | null;
    title: string;
}

/**
 * VideoDetailPlayer
 *
 * @description
 * The detail page's playback surface. Extracts the YouTube id from the
 * entity's URL and renders the client-only Plyr embed, dynamically imported
 * with SSR off (Plyr touches `window` at import time) above a 16:9 poster
 * layer, so the server HTML and the chunk-loading window both show the
 * thumbnail with no layout shift. A video with no YouTube URL renders the
 * poster frame permanently instead of an empty player shell. The frame
 * wrapper clips everything to the standard `rounded-lg` card radius and
 * scopes the brand CSS.
 *
 * @param youtubeVideoUrl - The video's YouTube URL, or null when not yet attached.
 * @param thumbnailUrl - The video thumbnail, shown as the poster frame.
 * @param title - The video title (poster image alt text).
 */
export function VideoDetailPlayer({
    youtubeVideoUrl,
    thumbnailUrl,
    title
}: VideoDetailPlayerProps) {
    const youtubeId = extractYoutubeId(youtubeVideoUrl);

    if (!youtubeId) {
        return (
            <div className="video-detail-player w-full overflow-hidden rounded-lg">
                <VideoDetailPlayerPoster
                    thumbnailUrl={thumbnailUrl}
                    title={title}
                />
            </div>
        );
    }

    return (
        <div className="video-detail-player relative w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0">
                <VideoDetailPlayerPoster
                    thumbnailUrl={thumbnailUrl}
                    title={title}
                />
            </div>
            <div className="relative">
                <PlyrPlayer youtubeId={youtubeId} />
            </div>
        </div>
    );
}
