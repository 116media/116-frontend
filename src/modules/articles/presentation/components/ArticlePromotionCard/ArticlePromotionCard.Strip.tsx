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
            className="group flex flex-1 gap-3"
        >
            <div className="relative w-24 shrink-0 self-stretch overflow-hidden rounded-md md:w-36">
                {article.coverImageUrl && (
                    <Image
                        fill
                        sizes="128px"
                        alt={article.title}
                        src={article.coverImageUrl}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>

            <div className="flex flex-1 flex-col">
                <h3 className="font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-primary dark:group-hover:text-secondary">
                    {article.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {article.headline}
                </p>
                <span
                    className="mt-auto mb-2 text-xs flex items-center gap-2 text-muted-foreground"
                    suppressHydrationWarning
                >
                    <Calendar className="size-3.5" />
                    {formatRelativeDate(article.publishedAt)}
                </span>
            </div>
        </Link>
    );
}
