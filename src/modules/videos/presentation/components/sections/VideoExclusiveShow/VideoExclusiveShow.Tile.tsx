"use client";

import { Fragment } from "react";
import { SHOW_PANEL_GROUND } from "@/modules/videos/presentation/constants/showColors";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { fade } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the VideoExclusiveShowTile component.
 *
 * @interface VideoExclusiveShowTileProps
 * @property {number} [overlay] - Opacity of the ground wash over the tiles. The
 * poster panel leaves it off; a content panel raises it until its text reads cleanly.
 */
export interface VideoExclusiveShowTileProps {
    overlay?: number;
}

/**
 * VideoExclusiveShowTile
 *
 * @description
 * The show poster tiled and blurred across its panel, optionally under a wash of the
 * shared panel ground. Scaled past the panel edges so the blur never thins out at the
 * border; the panel clips it. Renders nothing when the show has no poster.
 */
export function VideoExclusiveShowTile({ overlay = 0 }: VideoExclusiveShowTileProps) {
    const { category } = useExclusiveShow();

    if (!category.posterUrl) return null;

    return (
        <Fragment>
            <div
                aria-hidden
                className="absolute inset-0 scale-125 blur-2xl"
                style={{
                    backgroundRepeat: "repeat",
                    backgroundSize: "280px auto",
                    backgroundImage: `url(${category.posterUrl})`
                }}
            />
            {overlay > 0 && (
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundColor: fade(SHOW_PANEL_GROUND, overlay) }}
                />
            )}
        </Fragment>
    );
}
