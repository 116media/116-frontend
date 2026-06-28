import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticleCard } from "@/modules/articles/presentation/components/ArticleCard";

/**
 * Props for ArticlesGrid.
 *
 * @interface ArticlesGridProps
 * @property {IArticleSummaryEntity[]} articles - The accumulated article summaries to render.
 */
export interface ArticlesGridProps {
    articles: IArticleSummaryEntity[];
}

/**
 * ArticlesGrid
 *
 * @description
 * The responsive grid of article cards — the homepage video-feed layout (1/2/4 columns)
 * without the section title or "view all" link. Purely presentational; the container
 * owns data and paging.
 *
 * @param articles - The accumulated article summaries to render.
 */
export function ArticlesGrid({ articles }: ArticlesGridProps) {
    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
                <ArticleCard.Feed
                    key={article.id}
                    article={article}
                />
            ))}
        </div>
    );
}
