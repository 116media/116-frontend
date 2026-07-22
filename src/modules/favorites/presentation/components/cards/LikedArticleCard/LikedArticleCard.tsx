"use client";

import { useRouter } from "next/navigation";

import type { IArticleActivityEntity } from "@/modules/articles/domain/entities/IArticleActivityEntity";
import { FavoriteArticleContent } from "@/modules/favorites/presentation/components/cards/FavoriteArticleContent";
import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for LikedArticleCard.
 *
 * @interface LikedArticleCardProps
 * @property {IArticleActivityEntity} activity - The liked article and its last-interaction timestamp.
 */
export interface LikedArticleCardProps {
    activity: IArticleActivityEntity;
}

/**
 * LikedArticleCard
 *
 * @description
 * A liked article tile: cover media plus the base article body (byline, meta, title,
 * headline, engagement) with the last-liked date in the favorites slot.
 */
export function LikedArticleCard({ activity }: LikedArticleCardProps) {
    const router = useRouter();
    const { article } = activity;
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
                    dateKind="liked"
                    date={activity.lastInteractedAt}
                />
            </FavoriteArticleContent>
        </FavoriteCard>
    );
}
