"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import type { ICommentedArticleEntity } from "@/modules/articles/domain/entities/ICommentedArticleEntity";
import { FavoriteArticleContent } from "@/modules/favorites/presentation/components/cards/FavoriteArticleContent";
import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { Button } from "@/shared/presentation/components/ui/Button";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLE_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for CommentedArticleCard.
 *
 * @interface CommentedArticleCardProps
 * @property {ICommentedArticleEntity} item - The commented-on article with the caller's latest comment.
 * @property {() => void} onViewComments - Opens the own-comments drawer for this article.
 */
export interface CommentedArticleCardProps {
    item: ICommentedArticleEntity;
    onViewComments: () => void;
}

/**
 * CommentedArticleCard
 *
 * @description
 * A commented-on article tile: cover media plus the base article body (byline, meta, title,
 * headline, engagement), then the caller's latest comment and actions to open the
 * own-comments drawer or jump to the article — all inside one card border.
 */
export function CommentedArticleCard({ item, onViewComments }: CommentedArticleCardProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { article } = item;
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
                <div className="-mx-3 -mb-3 mt-1 flex flex-col gap-3 rounded-lg bg-accent/50 p-3">
                    <FavoriteCard.Comment
                        date={item.lastCommentedAt}
                        body={item.latestComment.body}
                        commentCount={item.commentCount}
                    />
                    <FavoriteCard.Actions className="flex justify-between pt-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onViewComments}
                        >
                            {t("favorites.comments.viewComments")}
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            variant="brand-outline"
                        >
                            <Link href={href}>{t("favorites.comments.viewArticle")}</Link>
                        </Button>
                    </FavoriteCard.Actions>
                </div>
            </FavoriteArticleContent>
        </FavoriteCard>
    );
}
