import type { Metadata } from "next";
import { ARTISTS_FEATURE } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { FeatureComingSoonContainer } from "@/modules/coming-soon/presentation/containers/FeatureComingSoonContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Names the artists route in the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        title: t("comingSoon.artists.meta.title"),
        description: t("comingSoon.artists.description")
    };
}

/**
 * ArtistesPage
 *
 * @description
 * The artists route (`/artistes`). The header has linked here since the navigation was
 * built, so it answers with what the profiles will hold rather than a missing page.
 */
export default function ArtistesPage() {
    return <FeatureComingSoonContainer feature={ARTISTS_FEATURE} />;
}
