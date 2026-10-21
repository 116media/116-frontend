"use client";

import { useTranslation } from "react-i18next";

import { ARTISTES_PATH } from "@/shared/presentation/constants/paths";
import { MobileMegaMenuChips } from "./MobileMegaMenu.Chips";
import { MobileMegaMenuFeatured } from "./MobileMegaMenu.Featured";
import { MobileMegaMenuList } from "./MobileMegaMenu.List";
import { MobileMegaMenuSection } from "./MobileMegaMenu.Section";
import { DUMMY_ARTIST_GENRES, DUMMY_ARTISTS } from "./menu.dummy";
import type { MobileMegaMenuFooterProps } from "./types";

/**
 * MobileMegaMenu.Artists
 *
 * @description
 * The ARTISTES panel: genre chips above the artists-to-follow block. Both run on
 * placeholder data until the artists endpoints exist.
 */
export function MobileMegaMenuArtists({ onNavigate }: MobileMegaMenuFooterProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col pb-4">
            <MobileMegaMenuSection title={t("navigation.mobileMenu.genres")}>
                <MobileMegaMenuChips
                    onNavigate={onNavigate}
                    items={DUMMY_ARTIST_GENRES}
                />
            </MobileMegaMenuSection>

            <MobileMegaMenuFeatured
                onNavigate={onNavigate}
                viewAllHref={ARTISTES_PATH}
                title={t("navigation.mobileMenu.artistsToFollow")}
            >
                <MobileMegaMenuList
                    square
                    items={DUMMY_ARTISTS}
                    onNavigate={onNavigate}
                />
            </MobileMegaMenuFeatured>
        </div>
    );
}
