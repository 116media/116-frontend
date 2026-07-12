import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/shared/presentation/components/ui/Tag";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { Stats } from "./ArticlePromotionCard.Stats";
import type { ArticlePromotionCardProps } from "./types";

/**
 * Hero
 *
 * @description
 * Spot 1 hero variant: full-width cover with gradient overlays, category badge, and
 * engagement stats, linking to the article detail page. Overlay text is white since it
 * always sits on a dark gradient.
 */
export function Hero({ article }: ArticlePromotionCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group relative block h-full min-h-96 overflow-hidden rounded-xl sm:min-h-80 lg:min-h-0"
        >
            {article.coverImageUrl && (
                <Image
                    fill
                    alt={article.title}
                    src={article.coverImageUrl}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />
            <div
                className={cn(
                    "absolute inset-0 bg-linear-to-br from-primary/10 to-transparent",
                    "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                )}
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-4 xl:p-6">
                <Tag
                    as="span"
                    variant="ghost"
                    className="mb-2 bg-white/10 text-white/90 backdrop-blur-sm lg:mb-2 xl:mb-3"
                    prefix={
                        <span className="hidden size-2 animate-pulse rounded-full bg-secondary sm:block" />
                    }
                >
                    {article.categoryName}
                </Tag>

                <h3 className="mb-1 text-lg font-bold leading-tight text-white line-clamp-2 md:text-2xl lg:text-xl xl:text-3xl">
                    {article.title}
                </h3>

                <p className="mb-3 text-xs text-white/70 line-clamp-2 sm:mb-4 sm:text-sm sm:line-clamp-4 md:text-base md:line-clamp-4 lg:text-sm lg:line-clamp-3 xl:text-base xl:line-clamp-4">
                    {article.headline}
                </p>

                <div className="flex items-center gap-3 text-xs text-white/60 sm:gap-4 md:text-sm lg:text-xs xl:text-sm">
                    <Stats article={article} />
                </div>
            </div>
        </Link>
    );
}
