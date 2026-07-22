import type { Metadata } from "next";
import { Suspense } from "react";

import { FavoriteVideosContainer } from "@/modules/favorites/presentation/containers/FavoriteVideosContainer";

/**
 * Route metadata for the favorite-videos page: kept out of search indexes since it is a
 * per-user, auth-gated surface.
 */
export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

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
