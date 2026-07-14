import { Suspense } from "react";
import { ArticlePromotionFeedLoading } from "@/modules/articles/presentation/components/sections/ArticlePromotionFeed/ArticlePromotionFeed.Loading";
import { ArticlePromotionFeedContainer } from "@/modules/articles/presentation/containers/ArticlePromotionFeedContainer";
import { ShortsFeedSectionContainer } from "@/modules/shorts/presentation/containers/ShortsFeedSectionContainer";
import { VideoExclusiveShowSplitLoading } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/VideoExclusiveShow.Split.Loading";
import { ShowsSectionContainer } from "@/modules/videos/presentation/containers/ShowsSectionContainer";
import { VideoExclusiveShowContainer } from "@/modules/videos/presentation/containers/VideoExclusiveShowContainer";
import { VideoFeedSectionContainer } from "@/modules/videos/presentation/containers/VideoFeedSectionContainer";

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

            {/* Shorts — TikTok-style vertical clips strip */}
            <ShortsFeedSectionContainer />

            {/* Exclusive show — featured category and its episodes */}
            <Suspense fallback={<VideoExclusiveShowSplitLoading />}>
                <VideoExclusiveShowContainer variant="split" />
            </Suspense>

            {/* Shows — swipeable carousel of video categories */}
            <ShowsSectionContainer />

            {/* Video feed — a pinned category and its latest videos */}
            <VideoFeedSectionContainer />
        </div>
    );
}
