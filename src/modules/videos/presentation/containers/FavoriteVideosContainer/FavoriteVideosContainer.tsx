"use client";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { PlaylistsSection } from "@/modules/videos/presentation/components/sections/PlaylistsSection";
import { RatedVideosSection } from "@/modules/videos/presentation/components/sections/RatedVideosSection";
import { SharedVideosSection } from "@/modules/videos/presentation/components/sections/SharedVideosSection";
import { FAVORITE_VIDEO_COLLECTIONS } from "@/modules/videos/presentation/constants/favoriteVideoCollections";
import { useMyPlaylists } from "@/modules/videos/presentation/hooks/useMyPlaylists";
import { useMyRatedVideos } from "@/modules/videos/presentation/hooks/useMyRatedVideos";
import { useMySharedVideos } from "@/modules/videos/presentation/hooks/useMySharedVideos";
import { FilmIcon } from "@/shared/presentation/components/ui/Icon";
import { FAVORITES_COLLECTION_PARAM } from "@/shared/presentation/constants/favorites";
import { FavoriteLayout } from "@/shared/presentation/layouts/FavoriteLayout";
import { normalizeCollection } from "@/shared/presentation/utils/collection/collection.utils";

/**
 * FavoriteVideosContainer
 *
 * @description
 * Smart container for `/favorites/videos`: reads and normalizes the `collection` param,
 * gates on the auth session via the shared shell, resolves each collection's total for the
 * tab counts, then renders the collection tabs above whichever video island is active.
 */
export function FavoriteVideosContainer() {
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();
    const collection = normalizeCollection(
        searchParams.get(FAVORITES_COLLECTION_PARAM),
        FAVORITE_VIDEO_COLLECTIONS
    );

    const playlists = useMyPlaylists(isAuthenticated);
    const rated = useMyRatedVideos(isAuthenticated);
    const shared = useMySharedVideos(isAuthenticated);

    const counts: Record<string, number | undefined> = {
        playlists: playlists.data?.length,
        rated: rated.data?.pages[0]?.count,
        shared: shared.data?.pages[0]?.count
    };

    return (
        <FavoriteLayout.Collection
            icon={<FilmIcon />}
            headingKey="favorites.headings.videos"
            subtitleKey="favorites.subtitles.videos"
        >
            <FavoriteLayout.Tabs
                active={collection}
                collections={FAVORITE_VIDEO_COLLECTIONS.map((key) => ({
                    key,
                    count: counts[key]
                }))}
            />
            {collection === "playlists" && <PlaylistsSection />}
            {collection === "rated" && <RatedVideosSection />}
            {collection === "shared" && <SharedVideosSection />}
        </FavoriteLayout.Collection>
    );
}
