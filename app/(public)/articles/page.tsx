import { Suspense } from "react";

import { ArticlePromotionFeedContainer } from "@/modules/articles/presentation/components/ArticlePromotionFeed";
import { ArticlePromotionFeedLoading } from "@/modules/articles/presentation/components/ArticlePromotionFeed/ArticlePromotionFeed.Loading";
import { ArticlesFeedContainer } from "@/modules/articles/presentation/components/ArticlesGrid";

/**
 * ArticlesPage
 *
 * @description
 * The public articles listing (`/articles`): the promoted-articles feed (reused from the
 * homepage, server-rendered inside its own `<Suspense>` boundary) above the filter
 * toolbar and an infinite-scrolling grid of every published article.
 */
export default function ArticlesPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>
            <ArticlesFeedContainer />
        </div>
    );
}
