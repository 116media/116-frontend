"use client";

import { useRouter } from "next/navigation";

import type { IArticleBookmarkEntity } from "@/modules/articles/domain/entities/IArticleBookmarkEntity";
import { FavoriteArticleContent } from "@/modules/articles/presentation/components/cards/FavoriteArticleContent";
import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for BookmarkedArticleCard.
 *
 * @interface BookmarkedArticleCardProps
 * @property {IArticleBookmarkEntity} bookmark - The bookmarked article and its saved timestamp.
 */
export interface BookmarkedArticleCardProps {
    bookmark: IArticleBookmarkEntity;
}

/**
 * BookmarkedArticleCard
 *
 * @description
 * A bookmarked article tile: cover media plus the base article body (byline, meta, title,
 * headline, engagement) with the saved date in the favorites slot. Unbookmarking is driven
 * by the engagement bar's bookmark button.
 */
export function BookmarkedArticleCard({ bookmark }: BookmarkedArticleCardProps) {
    const router = useRouter();
    const { article } = bookmark;
    const href = ARTICLE_DETAIL_PATH.replace(":slug", article.slug);

    return (
        <FavoriteCard>
            <FavoriteCard.Media
                aspect="video"
                alt={article.title}
                onOpen={() => router.push(href)}
                thumbnailUrl={article.coverImageUrl}
                icon={<NewspaperIcon className="size-10" />}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <FavoriteArticleContent article={article}>
                <FavoriteCard.Meta
                    dateKind="bookmarked"
                    date={bookmark.bookmarkedAt}
                    className="-mx-3 -mb-3 mt-auto flex flex-col gap-3 rounded-lg bg-accent/50 p-3 transition-colors group-hover:bg-muted dark:group-hover:bg-background"
                />
            </FavoriteArticleContent>
        </FavoriteCard>
    );
}
