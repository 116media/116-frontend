"use client";

import { useSearchParams } from "next/navigation";

import { ArticlesGridLoading } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Loading";
import { useMyArticleBookmarks } from "@/modules/articles/presentation/hooks/useMyArticleBookmarks";
import { useMyCommentedArticles } from "@/modules/articles/presentation/hooks/useMyCommentedArticles";
import { useMyLikedArticles } from "@/modules/articles/presentation/hooks/useMyLikedArticles";
import { useMySharedArticles } from "@/modules/articles/presentation/hooks/useMySharedArticles";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { FavoriteCollectionTabs } from "@/modules/favorites/presentation/components/navigation/FavoriteCollectionTabs";
import { BookmarkedArticlesSection } from "@/modules/favorites/presentation/components/sections/BookmarkedArticlesSection";
import { CommentedArticlesSection } from "@/modules/favorites/presentation/components/sections/CommentedArticlesSection";
import { FavoriteCollectionShell } from "@/modules/favorites/presentation/components/sections/FavoriteCollectionShell";
import { LikedArticlesSection } from "@/modules/favorites/presentation/components/sections/LikedArticlesSection";
import { SharedArticlesSection } from "@/modules/favorites/presentation/components/sections/SharedArticlesSection";
import {
    FAVORITE_ARTICLE_COLLECTIONS,
    FAVORITES_COLLECTION_PARAM
} from "@/modules/favorites/presentation/constants/favoritesCollections";
import { normalizeArticleCollection } from "@/modules/favorites/presentation/utils/collections/collections.utils";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

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
    const collection = normalizeArticleCollection(searchParams.get(FAVORITES_COLLECTION_PARAM));

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
        <FavoriteCollectionShell
            icon={<NewspaperIcon />}
            context="favorites-articles"
            headingKey="favorites.headings.articles"
            subtitleKey="favorites.subtitles.articles"
            skeleton={<ArticlesGridLoading />}
        >
            <FavoriteCollectionTabs
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
        </FavoriteCollectionShell>
    );
}
