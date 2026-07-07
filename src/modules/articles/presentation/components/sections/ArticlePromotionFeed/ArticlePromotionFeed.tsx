import { HeroCarousel } from "@/modules/articles/presentation/components/carousels/HeroCarousel";
import { PairCarousel } from "@/modules/articles/presentation/components/carousels/PairCarousel";
import { SideCarousel } from "@/modules/articles/presentation/components/carousels/SideCarousel";
import { GossipStrip } from "@/modules/articles/presentation/components/sections/GossipStrip";

import type { ArticlePromotionFeedViewProps } from "./types";

/**
 * ArticlePromotionFeed
 *
 * @description
 * Presentation component for the homepage article promotion grid: hero and pair
 * carousels on the left, side carousel and gossip strip on the right, stacked into a
 * single column on mobile.
 */
export function ArticlePromotionFeed({ feed }: ArticlePromotionFeedViewProps) {
    return (
        <section className="grid grid-cols-1 gap-2 overflow-hidden sm:gap-3 md:gap-4 lg:h-full lg:grid-cols-[3fr_2fr] 2xl:h-[80vh]">
            <div className="grid min-w-0 gap-2 overflow-hidden sm:gap-3 md:gap-4 lg:grid-rows-[4fr_2fr]">
                <HeroCarousel articles={feed.hero} />
                <PairCarousel
                    pairA={feed.pairA}
                    pairB={feed.pairB}
                />
            </div>

            <div className="grid min-w-0 gap-2 overflow-hidden sm:gap-3 md:gap-4 lg:grid-rows-[2fr_2.5fr]">
                <SideCarousel articles={feed.side} />
                <GossipStrip articles={feed.gossipStrip} />
            </div>
        </section>
    );
}
