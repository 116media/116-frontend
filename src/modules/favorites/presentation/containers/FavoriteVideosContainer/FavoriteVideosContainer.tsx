"use client";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { FavoriteCollectionTabs } from "@/modules/favorites/presentation/components/navigation/FavoriteCollectionTabs";
import { FavoriteCollectionShell } from "@/modules/favorites/presentation/components/sections/FavoriteCollectionShell";
import { PlaylistsSection } from "@/modules/favorites/presentation/components/sections/PlaylistsSection";
import { RatedVideosSection } from "@/modules/favorites/presentation/components/sections/RatedVideosSection";
import { SharedVideosSection } from "@/modules/favorites/presentation/components/sections/SharedVideosSection";
import {
    FAVORITE_VIDEO_COLLECTIONS,
    FAVORITES_COLLECTION_PARAM
} from "@/modules/favorites/presentation/constants/favoritesCollections";
import { normalizeVideoCollection } from "@/modules/favorites/presentation/utils/collections/collections.utils";
import { VideosGridLoading } from "@/modules/videos/presentation/components/sections/VideosGrid/VideosGrid.Loading";
import { useMyPlaylists } from "@/modules/videos/presentation/hooks/useMyPlaylists";
import { useMyRatedVideos } from "@/modules/videos/presentation/hooks/useMyRatedVideos";
import { useMySharedVideos } from "@/modules/videos/presentation/hooks/useMySharedVideos";
import { FilmIcon } from "@/shared/presentation/components/ui/Icon";

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
    const collection = normalizeVideoCollection(searchParams.get(FAVORITES_COLLECTION_PARAM));

    const playlists = useMyPlaylists(isAuthenticated);
    const rated = useMyRatedVideos(isAuthenticated);
    const shared = useMySharedVideos(isAuthenticated);

    const counts: Record<string, number | undefined> = {
        playlists: playlists.data?.length,
        rated: rated.data?.pages[0]?.count,
        shared: shared.data?.pages[0]?.count
    };

    return (
        <FavoriteCollectionShell
            icon={<FilmIcon />}
            context="favorites-videos"
            headingKey="favorites.headings.videos"
            subtitleKey="favorites.subtitles.videos"
            skeleton={<VideosGridLoading />}
        >
            <FavoriteCollectionTabs
                active={collection}
                collections={FAVORITE_VIDEO_COLLECTIONS.map((key) => ({
                    key,
                    count: counts[key]
                }))}
            />
            {collection === "playlists" && <PlaylistsSection />}
            {collection === "rated" && <RatedVideosSection />}
            {collection === "shared" && <SharedVideosSection />}
        </FavoriteCollectionShell>
    );
}
