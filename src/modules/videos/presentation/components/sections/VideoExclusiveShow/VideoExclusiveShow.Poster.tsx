"use client";

import Image from "next/image";
import { Fragment } from "react";
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
 * The show's poster as a fill image. A bleeding poster covers the section as its
 * background; a panel poster is shown whole over a tiled, blurred copy of itself, so the
 * artwork is never cropped and the panel never shows empty bands. Renders nothing when
 * the show has no poster.
 */
export function VideoExclusiveShowPoster({ bleed = false }: VideoExclusiveShowPosterProps) {
    const { category } = useExclusiveShow();

    if (!category.posterUrl) return null;

    return (
        <Fragment>
            {!bleed && (
                <div
                    aria-hidden
                    className="absolute inset-0 scale-125 blur-sm"
                    style={{
                        backgroundImage: `url(${category.posterUrl})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "280px auto"
                    }}
                />
            )}
            <Image
                fill
                priority
                alt={category.name}
                src={category.posterUrl}
                className={bleed ? "object-cover" : "object-contain"}
                sizes={
                    bleed ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 1024px) 100vw, 55vw"
                }
            />
        </Fragment>
    );
}
