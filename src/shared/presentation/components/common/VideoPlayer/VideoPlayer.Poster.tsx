import Image from "next/image";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideoPlayer.Poster.
 *
 * @interface VideoPlayerPosterProps
 * @property {string | null} thumbnailUrl - The video thumbnail, or null when unset.
 * @property {string} title - The video title, used as the image alt text.
 */
export interface VideoPlayerPosterProps {
    thumbnailUrl: string | null;
    title: string;
}

/**
 * VideoPlayer.Poster
 *
 * @description
 * The 16:9 poster frame shown in place of the player: the dynamic-import loading
 * fallback and the permanent surface when the video has no YouTube URL. Renders the
 * thumbnail with a play glyph, or a muted glyph-only surface when both are missing.
 */
export function VideoPlayerPoster({ thumbnailUrl, title }: VideoPlayerPosterProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {thumbnailUrl && (
                <Image
                    fill
                    priority
                    alt={title}
                    src={thumbnailUrl}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayIcon className="size-14 fill-white/90 text-white/90" />
            </div>
        </div>
    );
}
