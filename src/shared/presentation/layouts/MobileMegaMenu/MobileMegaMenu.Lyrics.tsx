"use client";

import { useTranslation } from "react-i18next";

import { LYRICS_PATH } from "@/shared/presentation/constants/paths";
import { MobileMegaMenuChips } from "./MobileMegaMenu.Chips";
import { MobileMegaMenuFeatured } from "./MobileMegaMenu.Featured";
import { MobileMegaMenuList } from "./MobileMegaMenu.List";
import { MobileMegaMenuSection } from "./MobileMegaMenu.Section";
import { DUMMY_LYRIC_GENRES, DUMMY_TOP_LYRICS } from "./menu.dummy";
import type { MobileMegaMenuFooterProps } from "./types";

/**
 * MobileMegaMenu.Lyrics
 *
 * @description
 * The LYRICS panel: the week's ranked top songs above the genre chips. Both run on
 * placeholder data until the lyrics endpoints exist.
 */
export function MobileMegaMenuLyrics({ onNavigate }: MobileMegaMenuFooterProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col pb-4">
            <MobileMegaMenuFeatured
                onNavigate={onNavigate}
                viewAllHref={LYRICS_PATH}
                title={t("navigation.mobileMenu.topLyrics")}
            >
                <MobileMegaMenuList
                    square
                    onNavigate={onNavigate}
                    items={DUMMY_TOP_LYRICS}
                />
            </MobileMegaMenuFeatured>

            <MobileMegaMenuSection title={t("navigation.mobileMenu.byGenre")}>
                <MobileMegaMenuChips
                    onNavigate={onNavigate}
                    items={DUMMY_LYRIC_GENRES}
                />
            </MobileMegaMenuSection>
        </div>
    );
}
