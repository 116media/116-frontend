"use client";

import Image from "next/image";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";

/**
 * Props for the VideoExclusiveShowPoster component.
 *
 * @interface VideoExclusiveShowPosterProps
 * @property {boolean} [bleed] - True when the poster fills the whole section as a
 * background (hero); false when it fills a side panel (split).
 */
export interface VideoExclusiveShowPosterProps {
    bleed?: boolean;
}

/**
 * VideoExclusiveShowPoster
 *
 * @description
 * The show's landscape poster as a fill image, sized for its nearest relative
 * ancestor. Renders nothing when the show has no poster.
 */
export function VideoExclusiveShowPoster({ bleed = false }: VideoExclusiveShowPosterProps) {
    const { category } = useExclusiveShow();

    if (!category.posterUrl) return null;

    return (
        <Image
            fill
            priority
            alt={category.name}
            src={category.posterUrl}
            className="object-cover"
            sizes={bleed ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 1024px) 100vw, 55vw"}
        />
    );
}
