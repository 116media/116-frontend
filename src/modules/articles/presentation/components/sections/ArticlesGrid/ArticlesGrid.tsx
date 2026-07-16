import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticleCard } from "@/modules/articles/presentation/components/cards/ArticleCard";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Large-breakpoint column count per layout variant (mobile is always 1, tablet 2).
 */
const GRID_COLUMNS = {
    feed: "sm:grid-cols-2 lg:grid-cols-4",
    compact: "sm:grid-cols-2 lg:grid-cols-3"
} as const;

/**
 * Props for ArticlesGrid.
 *
 * @interface ArticlesGridProps
 * @property {IArticleSummaryEntity[]} articles - The accumulated article summaries to render.
 * @property {"feed" | "compact"} [columns] - Column layout: `feed` (1/2/4, default) or `compact` (1/2/3).
 */
export interface ArticlesGridProps {
    articles: IArticleSummaryEntity[];
    columns?: keyof typeof GRID_COLUMNS;
}

/**
 * ArticlesGrid
 *
 * @description
 * The responsive grid of article cards without the section title or "view all" link.
 * `feed` mirrors the homepage layout (1/2/4); `compact` is denser (1/2/3). Purely
 * presentational; the container owns data and paging.
 */
export function ArticlesGrid({ articles, columns = "feed" }: ArticlesGridProps) {
    return (
        <div className={cn("grid grid-cols-1 gap-x-4 gap-y-8", GRID_COLUMNS[columns])}>
            {articles.map((article) => (
                <ArticleCard.Feed
                    key={article.id}
                    article={article}
                />
            ))}
        </div>
    );
}
