import { Suspense } from "react";

import { ArticlePromotionFeedContainer } from "@/modules/articles/presentation/components/ArticlePromotionFeed";
import { ArticlePromotionFeedLoading } from "@/modules/articles/presentation/components/ArticlePromotionFeed/ArticlePromotionFeed.Loading";

/**
 * HomePage
 *
 * @description
 * Public homepage (`/`). Each content section is wrapped in its own
 * `<Suspense>` boundary so sections stream independently as their
 * server-side data resolves. More sections (trending, latest, etc.)
 * will be added below the promotion feed in future iterations.
 */
export default function HomePage() {
    return (
        <>
            {/* Promotion feed — above the fold */}
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>
        </>
    );
}
