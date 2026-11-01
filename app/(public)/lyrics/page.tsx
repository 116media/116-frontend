import type { Metadata } from "next";
import { LYRICS_FEATURE } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { FeatureComingSoonContainer } from "@/modules/coming-soon/presentation/containers/FeatureComingSoonContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Names the lyrics route in the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        title: t("comingSoon.lyrics.meta.title"),
        description: t("comingSoon.lyrics.description")
    };
}

/**
 * LyricsPage
 *
 * @description
 * The lyrics route (`/lyrics`). The header has linked here since the navigation was
 * built, so it answers with what the catalog will hold rather than a missing page.
 */
export default function LyricsPage() {
    return <FeatureComingSoonContainer feature={LYRICS_FEATURE} />;
}
