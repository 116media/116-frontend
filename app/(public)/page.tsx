import { Suspense } from "react";

import { ArticlePromotionFeedContainer } from "@/modules/articles/presentation/components/ArticlePromotionFeed";
import { ArticlePromotionFeedLoading } from "@/modules/articles/presentation/components/ArticlePromotionFeed/ArticlePromotionFeed.Loading";
import { VideoExclusiveShowContainer } from "@/modules/videos/presentation/components/VideoExclusiveShow";
import { VideoExclusiveShowLoading } from "@/modules/videos/presentation/components/VideoExclusiveShow/VideoExclusiveShow.Loading";
import { VideoFeedSectionContainer } from "@/modules/videos/presentation/components/VideoFeedSection";

/**
 * HomePage
 *
 * @description
 * Public homepage (`/`). Each content section is wrapped in its own
 * `<Suspense>` boundary so sections stream independently as their
 * server-side data resolves. More sections (trending, latest, etc.)
 * will be added below the exclusive show in future iterations.
 */
export default function HomePage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            {/* Promotion feed — above the fold */}
            <Suspense fallback={<ArticlePromotionFeedLoading />}>
                <ArticlePromotionFeedContainer />
            </Suspense>

            {/* Exclusive show — featured category and its episodes */}
            <Suspense fallback={<VideoExclusiveShowLoading />}>
                <VideoExclusiveShowContainer />
            </Suspense>

            {/* Video feed — a pinned category and its latest videos */}
            <VideoFeedSectionContainer />
        </div>
    );
}
