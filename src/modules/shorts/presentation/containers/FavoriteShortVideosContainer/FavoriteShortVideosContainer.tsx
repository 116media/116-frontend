"use client";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { LikedShortsSection } from "@/modules/shorts/presentation/components/sections/LikedShortsSection";
import { SavedShortsSection } from "@/modules/shorts/presentation/components/sections/SavedShortsSection";
import { SharedShortsSection } from "@/modules/shorts/presentation/components/sections/SharedShortsSection";
import { FAVORITE_SHORT_COLLECTIONS } from "@/modules/shorts/presentation/constants/favoriteShortCollections";
import { useMyLikedShorts } from "@/modules/shorts/presentation/hooks/useMyLikedShorts";
import { useMySavedShorts } from "@/modules/shorts/presentation/hooks/useMySavedShorts";
import { useMySharedShorts } from "@/modules/shorts/presentation/hooks/useMySharedShorts";
import { SmartphoneIcon } from "@/shared/presentation/components/ui/Icon";
import { FAVORITES_COLLECTION_PARAM } from "@/shared/presentation/constants/favorites";
import { FavoriteLayout } from "@/shared/presentation/layouts/FavoriteLayout";
import { normalizeCollection } from "@/shared/presentation/utils/collection/collection.utils";

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
    const collection = normalizeCollection(
        searchParams.get(FAVORITES_COLLECTION_PARAM),
        FAVORITE_SHORT_COLLECTIONS
    );

    const liked = useMyLikedShorts(isAuthenticated);
    const saved = useMySavedShorts(isAuthenticated);
    const shared = useMySharedShorts(isAuthenticated);

    const counts: Record<string, number | undefined> = {
        liked: liked.data?.pages[0]?.count,
        saved: saved.data?.pages[0]?.count,
        shared: shared.data?.pages[0]?.count
    };

    return (
        <FavoriteLayout.Collection
            icon={<SmartphoneIcon />}
            headingKey="favorites.headings.shorts"
            subtitleKey="favorites.subtitles.shorts"
        >
            <FavoriteLayout.Tabs
                active={collection}
                collections={FAVORITE_SHORT_COLLECTIONS.map((key) => ({
                    key,
                    count: counts[key]
                }))}
            />
            {collection === "liked" && <LikedShortsSection />}
            {collection === "saved" && <SavedShortsSection />}
            {collection === "shared" && <SharedShortsSection />}
        </FavoriteLayout.Collection>
    );
}
