import { Calendar, Heart, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/shared/presentation/components/ui/Tag";
import { formatRelativeDate } from "@/shared/presentation/utils/formatRelativeDate";

import type { ArticlePromotionCardProps } from "./types";

/**
 * Side
 *
 * @description
 * Spot 2 card variant — bordered card with hover effect.
 * Features an inline date + category header, horizontal image and text
 * layout, a separator, and engagement stats pinned to the bottom.
 * Uses theme tokens for border, background, and text colors so it
 * adapts to both light and dark modes.
 * Clicking the card navigates to the article detail page.
 */
export function Side({ article }: ArticlePromotionCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
        >
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span suppressHydrationWarning>{formatRelativeDate(article.publishedAt)}</span>
                    <span className="mx-1 h-4 w-px bg-border" />
                    <Tag as="span">{article.categoryName}</Tag>
                </div>

                <div className="flex flex-1 gap-5">
                    <div className="relative h-full w-full shrink-0 overflow-hidden rounded-lg md:w-1/3">
                        {article.coverImageUrl && (
                            <Image
                                fill
                                alt={article.title}
                                src={article.coverImageUrl}
                                sizes="(max-width: 768px) 100vw, 15vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                    </div>

                    <div className="flex flex-1 flex-col">
                        <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                            {article.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-4">{article.headline}</p>
                    </div>
                </div>

                <hr className="my-6" />

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1 text-sm">
                            <MessageSquare className="size-4" />
                            {article.commentCount}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                            <Heart className="size-4" />
                            {article.likeCount}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                            <Share2 className="size-4" />
                            {article.shareCount}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
