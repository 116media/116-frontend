import { Calendar, Heart, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";
import { Tag } from "@/shared/presentation/components/ui/Tag";

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
            className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
        >
            <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6 lg:p-3 xl:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:mb-4 md:text-sm lg:mb-3 lg:text-xs xl:text-sm">
                    <Calendar className="size-3 sm:size-3.5 lg:size-3" />
                    <RelativeDate date={article.publishedAt} />
                    <span className="mx-1 h-4 w-px bg-border" />
                    <Tag
                        as="span"
                        size="sm"
                    >
                        {article.categoryName}
                    </Tag>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-5">
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg sm:h-auto sm:w-1/3">
                        {article.coverImageUrl && (
                            <Image
                                fill
                                alt={article.title}
                                src={article.coverImageUrl}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 15vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="mb-2 text-base font-bold transition-colors group-hover:text-primary dark:group-hover:text-secondary sm:mb-3 sm:text-xl md:text-2xl lg:mb-1 lg:text-sm xl:text-lg">
                            {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 md:text-base md:line-clamp-4 lg:text-[11px] lg:leading-relaxed lg:line-clamp-2 xl:text-sm xl:line-clamp-4">
                            {article.headline}
                        </p>
                    </div>
                </div>

                <hr className="my-4 sm:my-6 lg:my-3 xl:my-6" />

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm md:text-base lg:text-xs xl:text-sm">
                        <span className="flex items-center gap-1">
                            <MessageSquare className="size-3.5 sm:size-4" />
                            {article.commentCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="size-3.5 sm:size-4" />
                            {article.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Share2 className="size-3.5 sm:size-4" />
                            {article.shareCount}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
