"use client";

import Image from "next/image";
import type { ComponentProps, ReactElement } from "react";

/**
 * VideoPlayer.PosterImage
 *
 * @description
 * The poster frame, drawn through `next/image` instead of a skin's own `<img>` so it goes
 * through the image pipeline like every other thumbnail in the app. Skins resolve the
 * source themselves and hand it over as image props.
 *
 * @param props - The image props the skin resolves, including the poster `src`.
 * @returns The poster image, or null before a source resolves.
 */
export function VideoPlayerPosterImage({ src, alt }: ComponentProps<"img">): ReactElement | null {
    if (typeof src !== "string" || !src) return null;

    return (
        <Image
            fill
            priority
            src={src}
            alt={alt ?? ""}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
        />
    );
}
