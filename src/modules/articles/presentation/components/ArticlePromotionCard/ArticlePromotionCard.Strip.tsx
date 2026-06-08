import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatRelativeDate } from "@/shared/presentation/utils/formatRelativeDate";
import type { ArticlePromotionCardProps } from "./types";

/**
 * Strip
 *
 * @description
 * Gossip strip card variant — compact horizontal card with a
 * thumbnail, article title, headline, and relative published date
 * in the bottom-right corner.
 * Clicking navigates to the article detail page.
 */
export function Strip({ article }: ArticlePromotionCardProps) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group flex min-w-0 flex-1 gap-2 sm:gap-3"
        >
            <div className="relative min-h-18 w-28 shrink-0 self-stretch overflow-hidden rounded-md sm:w-24 md:w-36">
                {article.coverImageUrl && (
                    <Image
                        fill
                        alt={article.title}
                        src={article.coverImageUrl}
                        sizes="(max-width: 640px) 112px, (max-width: 768px) 96px, 144px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary dark:group-hover:text-secondary sm:text-base sm:whitespace-normal sm:line-clamp-2">
                    {article.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 sm:mt-1 sm:text-sm sm:line-clamp-2">
                    {article.headline}
                </p>
                <span
                    className="mt-auto mb-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:mb-2 sm:gap-2"
                    suppressHydrationWarning
                >
                    <Calendar className="size-3 sm:size-3.5" />
                    {formatRelativeDate(article.publishedAt)}
                </span>
            </div>
        </Link>
    );
}
