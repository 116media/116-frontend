"use client";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { FavoriteCollectionTabs } from "@/modules/favorites/presentation/components/navigation/FavoriteCollectionTabs";
import { FavoriteCollectionShell } from "@/modules/favorites/presentation/components/sections/FavoriteCollectionShell";
import { FavoriteShortsGridLoading } from "@/modules/favorites/presentation/components/sections/FavoriteShortsGrid/FavoriteShortsGrid.Loading";
import { LikedShortsSection } from "@/modules/favorites/presentation/components/sections/LikedShortsSection";
import { SavedShortsSection } from "@/modules/favorites/presentation/components/sections/SavedShortsSection";
import { SharedShortsSection } from "@/modules/favorites/presentation/components/sections/SharedShortsSection";
import {
    FAVORITE_SHORT_COLLECTIONS,
    FAVORITES_COLLECTION_PARAM
} from "@/modules/favorites/presentation/constants/favoritesCollections";
import { normalizeShortCollection } from "@/modules/favorites/presentation/utils/collections/collections.utils";
import { useMyLikedShorts } from "@/modules/shorts/presentation/hooks/useMyLikedShorts";
import { useMySavedShorts } from "@/modules/shorts/presentation/hooks/useMySavedShorts";
import { useMySharedShorts } from "@/modules/shorts/presentation/hooks/useMySharedShorts";
import { SmartphoneIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * FavoriteShortVideosContainer
 *
 * @description
 * Smart container for `/favorites/shorts`: reads and normalizes the `collection` param,
 * gates on the auth session via the shared shell, resolves each collection's total for the
 * tab counts, then renders the collection tabs above whichever shorts island is active.
 */
export function FavoriteShortVideosContainer() {
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();
    const collection = normalizeShortCollection(searchParams.get(FAVORITES_COLLECTION_PARAM));

    const liked = useMyLikedShorts(isAuthenticated);
    const saved = useMySavedShorts(isAuthenticated);
    const shared = useMySharedShorts(isAuthenticated);

    const counts: Record<string, number | undefined> = {
        liked: liked.data?.pages[0]?.count,
        saved: saved.data?.pages[0]?.count,
        shared: shared.data?.pages[0]?.count
    };

    return (
        <FavoriteCollectionShell
            context="favorites-shorts"
            icon={<SmartphoneIcon />}
            headingKey="favorites.headings.shorts"
            subtitleKey="favorites.subtitles.shorts"
            skeleton={<FavoriteShortsGridLoading />}
        >
            <FavoriteCollectionTabs
                active={collection}
                collections={FAVORITE_SHORT_COLLECTIONS.map((key) => ({
                    key,
                    count: counts[key]
                }))}
            />
            {collection === "liked" && <LikedShortsSection />}
            {collection === "saved" && <SavedShortsSection />}
            {collection === "shared" && <SharedShortsSection />}
        </FavoriteCollectionShell>
    );
}
