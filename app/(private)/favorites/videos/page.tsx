import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteVideosContainer } from "@/modules/videos/presentation/containers/FavoriteVideosContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the favorite-videos page: the translated title (reusing the page's
 * own on-page heading key) plus `robots: noindex`, kept out of search indexes since this is
 * a per-user, auth-gated surface.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return {
        title: t("favorites.headings.videos"),
        robots: { index: false, follow: false }
    };
}

/**
 * FavoriteVideosPage
 *
 * @description
 * The `/favorites/videos` route: the signed-in viewer's playlists, rated, and shared
 * videos. The container reads the `collection` param, so it renders inside a `<Suspense>`
 * boundary.
 */
export default function FavoriteVideosPage() {
    return (
        <Suspense>
            <FavoriteVideosContainer />
        </Suspense>
    );
}
