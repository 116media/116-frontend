import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteShortVideosContainer } from "@/modules/favorites/presentation/containers/FavoriteShortVideosContainer";

/**
 * Route metadata for the favorite-shorts page: kept out of search indexes since it is a
 * per-user, auth-gated surface.
 */
export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

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
