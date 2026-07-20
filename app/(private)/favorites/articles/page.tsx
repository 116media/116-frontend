import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteArticlesContainer } from "@/modules/articles/presentation/containers/FavoriteArticlesContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the favorite-articles page: the translated title (reusing the page's
 * own on-page heading key) plus `robots: noindex`, kept out of search indexes since this is
 * a per-user, auth-gated surface.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return {
        title: t("favorites.headings.articles"),
        robots: { index: false, follow: false }
    };
}

/**
 * FavoriteArticlesPage
 *
 * @description
 * The `/favorites/articles` route: the signed-in reader's saved, commented, liked, and
 * shared articles. The container reads the `collection` param, so it renders inside a
 * `<Suspense>` boundary.
 */
export default function FavoriteArticlesPage() {
    return (
        <Suspense>
            <FavoriteArticlesContainer />
        </Suspense>
    );
}
