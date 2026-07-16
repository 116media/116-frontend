import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Aspect ratio of the media region: 16:9 for articles and videos, 9:16 for shorts.
 */
export type FavoriteCardMediaAspect = "video" | "portrait";

/**
 * Props for FavoriteCard.Media.
 *
 * @interface FavoriteCardMediaProps
 * @property {() => void} onOpen - Opens the item's detail view when the media is activated.
 * @property {string} alt - Accessible label for the media and the image alt text.
 * @property {FavoriteCardMediaAspect} aspect - Fixed aspect box so tiles in a row stay equal height.
 * @property {string | null} [thumbnailUrl] - Thumbnail URL, or null/undefined to render the placeholder.
 * @property {string} [sizes] - Responsive `sizes` hint for the fill image.
 * @property {ReactNode} [icon] - Glyph shown on the muted placeholder when no thumbnail is set.
 * @property {ReactNode} [children] - Absolute overlays (badge, remove) positioned over the media.
 */
export interface FavoriteCardMediaProps {
    alt: string;
    sizes?: string;
    icon?: ReactNode;
    onOpen: () => void;
    children?: ReactNode;
    thumbnailUrl?: string | null;
    aspect: FavoriteCardMediaAspect;
}

const ASPECT_CLASS: Record<FavoriteCardMediaAspect, string> = {
    video: "aspect-video",
    portrait: "aspect-9/16"
};

/**
 * FavoriteCard.Media
 *
 * @description
 * The clickable thumbnail region: a fixed-aspect box with the cover image (or a muted
 * placeholder glyph) behind a full-cover open button, plus any absolute overlays passed
 * as children. Overlays are siblings of the button so they never nest interactive controls.
 */
export function FavoriteCardMedia({
    onOpen,
    alt,
    aspect,
    thumbnailUrl,
    sizes = "(max-width: 768px) 50vw, 25vw",
    icon,
    children
}: FavoriteCardMediaProps) {
    return (
        <div className={cn("relative block overflow-hidden bg-muted", ASPECT_CLASS[aspect])}>
            <button
                type="button"
                onClick={onOpen}
                aria-label={alt}
                className="block size-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {thumbnailUrl ? (
                    <Image
                        fill
                        alt={alt}
                        src={thumbnailUrl}
                        sizes={sizes}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                        {icon}
                    </span>
                )}
            </button>
            {children}
        </div>
    );
}
