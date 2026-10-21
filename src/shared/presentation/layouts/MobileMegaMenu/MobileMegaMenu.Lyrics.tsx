"use client";

import { LYRICS_FEATURE } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { LYRICS_PATH } from "@/shared/presentation/constants/paths";
import { MobileMegaMenuComingSoon } from "./MobileMegaMenu.ComingSoon";
import type { MobileMegaMenuFooterProps } from "./types";

/**
 * MobileMegaMenu.Lyrics
 *
 * @description
 * The LYRICS panel. The catalog is announced but not open, so the tab carries the same
 * waiting copy as the route rather than placeholder songs.
 */
export function MobileMegaMenuLyrics({ onNavigate }: MobileMegaMenuFooterProps) {
    return (
        <MobileMegaMenuComingSoon
            href={LYRICS_PATH}
            onNavigate={onNavigate}
            feature={LYRICS_FEATURE}
        />
    );
}
