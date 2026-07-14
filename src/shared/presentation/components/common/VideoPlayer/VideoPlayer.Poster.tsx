import Image from "next/image";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for VideoPlayer.Poster.
 *
 * @interface VideoPlayerPosterProps
 * @property {string | null} thumbnailUrl - The video thumbnail, or null when unset.
 * @property {string} title - The video title, used as the image alt text.
 * @property {string} [ratioClassName] - Aspect-ratio utility for the frame. Defaults to 16:9.
 */
export interface VideoPlayerPosterProps {
    thumbnailUrl: string | null;
    title: string;
    ratioClassName?: string;
}

/**
 * VideoPlayer.Poster
 *
 * @description
 * The poster frame shown in place of the player: the dynamic-import loading
 * fallback and the permanent surface when the video has no source. Renders the
 * thumbnail with a play glyph, or a muted glyph-only surface when both are missing.
 */
export function VideoPlayerPoster({
    thumbnailUrl,
    title,
    ratioClassName = "aspect-video"
}: VideoPlayerPosterProps) {
    return (
        <div className={cn("relative w-full overflow-hidden rounded-lg bg-muted", ratioClassName)}>
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
