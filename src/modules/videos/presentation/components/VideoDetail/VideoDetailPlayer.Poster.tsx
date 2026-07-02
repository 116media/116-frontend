import Image from "next/image";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideoDetailPlayer.Poster.
 *
 * @interface VideoDetailPlayerPosterProps
 * @property {string | null} thumbnailUrl - The video thumbnail, or null when unset.
 * @property {string} title - The video title, used as the image alt text.
 */
export interface VideoDetailPlayerPosterProps {
    thumbnailUrl: string | null;
    title: string;
}

/**
 * VideoDetailPlayer.Poster
 *
 * @description
 * The 16:9 poster frame shown in place of the player: as the dynamic-import
 * loading fallback (so the layout never shifts and the server HTML still
 * shows the cover) and as the permanent surface when the video has no YouTube
 * URL. Renders the thumbnail with a centered play glyph, or a muted glyph-only
 * surface when the thumbnail is also missing — never an empty Plyr shell.
 *
 * @param thumbnailUrl - The video thumbnail, or null when unset.
 * @param title - The video title (image alt text).
 */
export function VideoDetailPlayerPoster({ thumbnailUrl, title }: VideoDetailPlayerPosterProps) {
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
