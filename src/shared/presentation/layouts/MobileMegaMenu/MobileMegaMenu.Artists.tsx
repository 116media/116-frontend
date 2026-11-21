"use client";

import { ARTISTS_FEATURE } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { ARTISTES_PATH } from "@/shared/presentation/constants/paths";
import { MobileMegaMenuComingSoon } from "./MobileMegaMenu.ComingSoon";
import type { MobileMegaMenuFooterProps } from "./types";

/**
 * MobileMegaMenu.Artists
 *
 * @description
 * The ARTISTES panel. The profiles are announced but not open, so the tab carries the
 * same waiting copy as the route rather than placeholder artists.
 */
export function MobileMegaMenuArtists({ onNavigate }: MobileMegaMenuFooterProps) {
    return (
        <MobileMegaMenuComingSoon
            href={ARTISTES_PATH}
            onNavigate={onNavigate}
            feature={ARTISTS_FEATURE}
        />
    );
}
