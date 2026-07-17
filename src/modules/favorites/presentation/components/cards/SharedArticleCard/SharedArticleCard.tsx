"use client";

import { useRouter } from "next/navigation";

import type { IArticleActivityEntity } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import { FavoriteArticleContent } from "@/modules/favorites/presentation/components/cards/FavoriteArticleContent";
import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for SharedArticleCard.
 *
 * @interface SharedArticleCardProps
 * @property {IArticleActivityEntity} activity - The shared article with the caller's share tally.
 */
export interface SharedArticleCardProps {
    activity: IArticleActivityEntity;
}

/**
 * SharedArticleCard
 *
 * @description
 * A shared article tile: cover media plus the base article body (byline, meta, title,
 * headline, engagement) with the caller's own share count, last-shared date, and channel
 * in the favorites slot.
 */
export function SharedArticleCard({ activity }: SharedArticleCardProps) {
    const router = useRouter();
    const { article } = activity;
    const href = ARTICLE_DETAIL_PATH.replace(":slug", article.slug);

    return (
        <FavoriteCard>
            <FavoriteCard.Media
                aspect="video"
                alt={article.title}
                thumbnailUrl={article.coverImageUrl}
                onOpen={() => router.push(href)}
                icon={<NewspaperIcon className="size-10" />}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <FavoriteArticleContent article={article}>
                <FavoriteCard.Meta
                    dateKind="shared"
                    date={activity.lastInteractedAt}
                    shareCount={activity.interactionCount}
                    shareChannel={activity.lastShareChannel}
                    className="-mx-3 -mb-3 mt-1 flex justify-between gap-3 rounded-lg bg-accent/50 p-3"
                />
            </FavoriteArticleContent>
        </FavoriteCard>
    );
}
