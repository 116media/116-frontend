import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteShortVideosContainer } from "@/modules/shorts/presentation/containers/FavoriteShortVideosContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the favorite-shorts page: the translated title (reusing the page's
 * own on-page heading key) plus `robots: noindex`, kept out of search indexes since this is
 * a per-user, auth-gated surface.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return {
        title: t("favorites.headings.shorts"),
        robots: { index: false, follow: false }
    };
}

/**
 * FavoriteShortsPage
 *
 * @description
 * The `/favorites/shorts` route: the signed-in viewer's liked, saved, and shared shorts.
 * The container reads the `collection` param, so it renders inside a `<Suspense>`
 * boundary.
 */
export default function FavoriteShortsPage() {
    return (
        <Suspense>
            <FavoriteShortVideosContainer />
        </Suspense>
    );
}
