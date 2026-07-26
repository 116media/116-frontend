import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteArticlesContainer } from "@/modules/articles/presentation/containers/FavoriteArticlesContainer";

/**
 * Route metadata for the favorite-articles page: kept out of search indexes since it is a
 * per-user, auth-gated surface.
 */
export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

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
