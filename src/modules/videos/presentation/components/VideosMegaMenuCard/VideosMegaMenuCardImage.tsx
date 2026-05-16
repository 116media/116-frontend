"use client";

import Image from "next/image";

import type { VideosMegaMenuCardImageProps } from "./types";

/**
 * VideosMegaMenuCardImage
 *
 * @description
 * Shared image piece composed into both VideosMegaMenuCard.Featured and
 * VideosMegaMenuCard.Compact.
 *
 * - size="full"  → full-width aspect-video block for the Featured card.
 *   Gradient overlay bottom-to-top and category pill at bottom-left.
 *   No play icon — it lives on the card wrapper.
 *
 * - size="thumb" → fixed w-28 aspect-video thumbnail for the Compact card,
 *   matching the exact proportions used in the articles compact card so both
 *   mega menus share identical card heights. Clean image, no overlay or icon
 *   — the play button lives in the card wrapper corner, not on the image.
 *
 * Falls back to a muted placeholder when src is null.
 */
export function VideosMegaMenuCardImage({
    src,
    alt,
    categoryName,
    size
}: VideosMegaMenuCardImageProps) {
    if (size === "full") {
        return (
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1280px) 50vw, 320px"
                    />
                ) : (
                    <div className="h-full w-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white bg-primary/80">
                    {categoryName}
                </span>
            </div>
        );
    }

    return (
        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-muted">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="112px"
                />
            ) : (
                <div className="h-full w-full bg-muted" />
            )}
        </div>
    );
}
