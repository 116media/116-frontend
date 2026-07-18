"use client";

import { useSearchParams } from "next/navigation";

import { BookmarkedArticlesSection } from "@/modules/articles/presentation/components/sections/BookmarkedArticlesSection";
import { CommentedArticlesSection } from "@/modules/articles/presentation/components/sections/CommentedArticlesSection";
import { LikedArticlesSection } from "@/modules/articles/presentation/components/sections/LikedArticlesSection";
import { SharedArticlesSection } from "@/modules/articles/presentation/components/sections/SharedArticlesSection";
import { FAVORITE_ARTICLE_COLLECTIONS } from "@/modules/articles/presentation/constants/favoriteArticleCollections";
import { useMyArticleBookmarks } from "@/modules/articles/presentation/hooks/useMyArticleBookmarks";
import { useMyCommentedArticles } from "@/modules/articles/presentation/hooks/useMyCommentedArticles";
import { useMyLikedArticles } from "@/modules/articles/presentation/hooks/useMyLikedArticles";
import { useMySharedArticles } from "@/modules/articles/presentation/hooks/useMySharedArticles";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { FAVORITES_COLLECTION_PARAM } from "@/shared/presentation/constants/favorites";
import { FavoriteLayout } from "@/shared/presentation/layouts/FavoriteLayout";
import { normalizeCollection } from "@/shared/presentation/utils/collection/collection.utils";

/**
 * FavoriteArticlesContainer
 *
 * @description
 * Smart container for `/favorites/articles`: reads and normalizes the `collection` param,
 * gates on the auth session via the shared shell, resolves each collection's total for the
 * tab counts, then renders the collection tabs above whichever article island is active.
 */
export function FavoriteArticlesContainer() {
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuth();
    const collection = normalizeCollection(
        searchParams.get(FAVORITES_COLLECTION_PARAM),
        FAVORITE_ARTICLE_COLLECTIONS
    );

    const bookmarked = useMyArticleBookmarks(isAuthenticated);
    const commented = useMyCommentedArticles(isAuthenticated);
    const liked = useMyLikedArticles(isAuthenticated);
    const shared = useMySharedArticles(isAuthenticated);

    const counts: Record<string, number | undefined> = {
        bookmarked: bookmarked.data?.pages[0]?.count,
        commented: commented.data?.pages[0]?.count,
        liked: liked.data?.pages[0]?.count,
        shared: shared.data?.pages[0]?.count
    };

    return (
        <FavoriteLayout.Collection
            icon={<NewspaperIcon />}
            headingKey="favorites.headings.articles"
            subtitleKey="favorites.subtitles.articles"
        >
            <FavoriteLayout.Tabs
                active={collection}
                collections={FAVORITE_ARTICLE_COLLECTIONS.map((key) => ({
                    key,
                    count: counts[key]
                }))}
            />
            {collection === "bookmarked" && <BookmarkedArticlesSection />}
            {collection === "commented" && <CommentedArticlesSection />}
            {collection === "liked" && <LikedArticlesSection />}
            {collection === "shared" && <SharedArticlesSection />}
        </FavoriteLayout.Collection>
    );
}
