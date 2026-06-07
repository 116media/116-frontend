import { Fragment } from "react";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticlePromotionCard } from "@/modules/articles/presentation/components/ArticlePromotionCard";

interface GossipStripProps {
    articles: IArticleSummaryEntity[];
}

/**
 * GossipStrip
 *
 * @description
 * Static vertical list of gossip articles occupying the bottom-right
 * of the promotion grid. Wrapped in a muted container.
 * Not a carousel — renders server-side with no client interactivity.
 */
export function GossipStrip({ articles }: GossipStripProps) {
    if (articles.length === 0) return null;

    return (
        <div className="flex flex-1 flex-col rounded-xl bg-muted/30 p-6">
            <div className="flex flex-1 flex-col gap-4">
                {articles.map((article, index) => (
                    <Fragment key={article.id}>
                        <ArticlePromotionCard.Strip article={article} />
                        {index < articles.length - 1 && <hr />}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
